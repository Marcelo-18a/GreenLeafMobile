import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar, Dimensions } from 'react-native';
import MapView, { Heatmap, Region } from 'react-native-maps'; 
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CoordenadaCalor {
    latitude: number;
    longitude: number;
    weight: number; 
}

const API_URL = 'https://greenleafmobile.onrender.com/api/diagnosticos';

export default function MapaCalorScreen() {
    // Separamos os pontos em duas listas para calcular a densidade de cada ambiente de forma independente
    const [pontosInfectados, setPontosInfectados] = useState<CoordenadaCalor[]>([]);
    const [pontosSaudaveis, setPontosSaudaveis] = useState<CoordenadaCalor[]>([]);
    const [loading, setLoading] = useState(true);
    const [dynamicRadius, setDynamicRadius] = useState(40); 
    const [regiaoInicial, setRegiaoInicial] = useState({
        latitude: -24.7125, 
        longitude: -47.8824,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
    });

    useEffect(() => {
        const buscarPontosMapa = async () => {
            try {
                const token = await AsyncStorage.getItem('greenleaf_token');
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const dados = await response.json();
                    
                    if (Array.isArray(dados) && dados.length > 0) {
                        const infectados: CoordenadaCalor[] = [];
                        const saudaveis: CoordenadaCalor[] = [];

                        dados
                            .filter((item: any) => item.latitude && item.longitude) 
                            .forEach((item: any) => {
                                const ehInfeccao = item.statusText?.includes('Detectada') && !item.statusText?.includes('Nenhuma');
                                
                                const ponto = {
                                    latitude: Number(item.latitude),
                                    longitude: Number(item.longitude),
                                    weight: 1 // IMPORTANTE: Peso inicial idêntico (= 1) para todos para calcular por ACUMULAÇÃO
                                };

                                if (ehInfeccao) {
                                    infectados.push(ponto);
                                } else {
                                    saudaveis.push(ponto);
                                }
                            });

                        setPontosInfectados(infectados);
                        setPontosSaudaveis(saudaveis);

                        if (dados.length > 0) {
                            setRegiaoInicial({
                                latitude: Number(dados[0].latitude),
                                longitude: Number(dados[0].longitude),
                                latitudeDelta: 0.02,
                                longitudeDelta: 0.02,
                            });
                        }
                    }
                }
            } catch (error) {
                console.log("Erro ao carregar mapa de calor:", error);
            } finally {
                setLoading(false);
            }
        };

        buscarPontosMapa();
    }, []);

    // CONTROLE DE RAIO ADAPTATIVO CONFORME O ZOOM
    const handleRegionChangeComplete = (region: Region) => {
        const delta = region.latitudeDelta;
        let newRadius = 40;
        
        if (delta < 0.005) {
            newRadius = 70; 
        } else if (delta < 0.02) {
            newRadius = 45; 
        } else if (delta < 0.09) {
            newRadius = 25; 
        } else {
            newRadius = 12; 
        }
        
        setDynamicRadius(newRadius);
    };

    // Verifica se existe algum ponto em qualquer uma das listas
    const temPontos = pontosInfectados.length > 0 || pontosSaudaveis.length > 0;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* BOTÃO FLUTUANTE DE VOLTAR */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#57b947" />
                    <Text style={styles.loadingText}>Analisando densidade do ambiente...</Text>
                </View>
            ) : !temPontos ? (
                <View style={styles.center}>
                    <Ionicons name="map-outline" size={60} color="#999" />
                    <Text style={styles.emptyText}>Nenhum dado geográfico coletado para renderizar o mapa.</Text>
                </View>
            ) : (
                <MapView
                    style={styles.map}
                    initialRegion={regiaoInicial}
                    onRegionChangeComplete={handleRegionChangeComplete}
                >
                    {/* HEATMAP 1: AMBIENTE DE INFECÇÃO (Focos acumulados ficam vermelhos intensos) */}
                    {pontosInfectados.length > 0 && (
                        <Heatmap
                            points={pontosInfectados}
                            radius={dynamicRadius}
                            opacity={0.8}
                            gradient={{
                                // Transiciona de um tom amarelo/laranja suave (pouco infectado) para Vermelho Vivo (muito infectado junto)
                                colors: ['#ffeb3b', '#ff9800', '#ff0000'], 
                                startPoints: [0.1, 0.4, 0.8], 
                                colorMapSize: 256,
                            }}
                        />
                    )}

                    {/* HEATMAP 2: AMBIENTE SAUDÁVEL (Zonas limpas acumuladas ganham força no Verde) */}
                    {pontosSaudaveis.length > 0 && (
                        <Heatmap
                            points={pontosSaudaveis}
                            radius={dynamicRadius}
                            opacity={0.75}
                            gradient={{
                                // Transiciona de um tom verde-água bem clarinho para um Verde escuro encorpado
                                colors: ['#b9f6ca', '#00ff00', '#004d40'], 
                                startPoints: [0.1, 0.5, 0.9], 
                                colorMapSize: 256,
                            }}
                        />
                    )}
                </MapView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    backButton: {
        position: 'absolute',
        top: 45,
        left: 20,
        width: 45,
        height: 45,
        backgroundColor: '#fff',
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 999
    },
    loadingText: { marginTop: 12, fontSize: 15, color: '#555', fontWeight: '600' },
    emptyText: { marginTop: 12, fontSize: 16, color: '#777', fontWeight: '500', textAlign: 'center' }
});