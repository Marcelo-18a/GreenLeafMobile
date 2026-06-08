import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar, Dimensions } from 'react-native';
import MapView, { Heatmap } from 'react-native-maps'; // Alterado: tiramos o PROVIDER_GOOGLE
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
    const [pontos, setPontos] = useState<CoordenadaCalor[]>([]);
    const [loading, setLoading] = useState(true);
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
                        const pontosFormatados = dados
                            .filter((item: any) => item.latitude && item.longitude) // Evita coordenadas corrompidas ou nulas
                            .map((item: any) => {
                                const ehInfeccao = item.statusText?.includes('Bacteriose') || item.statusText?.includes('Detectada');
                                return {
                                    latitude: Number(item.latitude),
                                    longitude: Number(item.longitude),
                                    weight: ehInfeccao ? 3 : 1 
                                };
                            });

                        setPontos(pontosFormatados);

                        if (pontosFormatados.length > 0) {
                            setRegiaoInicial({
                                latitude: pontosFormatados[0].latitude,
                                longitude: pontosFormatados[0].longitude,
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
                    <Text style={styles.loadingText}>Gerando Mapa de Calor...</Text>
                </View>
            ) : pontos.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="map-outline" size={60} color="#999" />
                    <Text style={styles.emptyText}>Nenhum dado geográfico coletado para renderizar o mapa.</Text>
                </View>
            ) : (
                <MapView
                    style={styles.map}
                    initialRegion={regiaoInicial}
                >
                    <Heatmap
                        points={pontos}
                        radius={40} 
                        opacity={0.8}
                        gradient={{
                            colors: ['#0000ff', '#00ff00', '#ff0000'], 
                            startPoints: [0.2, 0.5, 0.8],
                            colorMapSize: 256,
                        }}
                    />
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