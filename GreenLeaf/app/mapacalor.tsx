import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
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
    const [pontosInfectados, setPontosInfectados] = useState<CoordenadaCalor[]>([]);
    const [pontosSaudaveis, setPontosSaudaveis] = useState<CoordenadaCalor[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Centralizado por padrão em Pariquera-Açu
    const [centroMapa, setCentroMapa] = useState({
        latitude: -24.7125,
        longitude: -47.8824
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
                                    weight: 1 
                                };

                                if (ehInfeccao) {
                                    infectados.push(ponto);
                                } else {
                                    saudaveis.push(ponto);
                                }
                            });

                        setPontosInfectados(infectados);
                        setPontosSaudaveis(saudaveis);

                        if (dados.length > 0 && dados[0].latitude && dados[0].longitude) {
                            setCentroMapa({
                                latitude: Number(dados[0].latitude),
                                longitude: Number(dados[0].longitude)
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

    const gerarHTMLMapa = () => {
        const arrayInfectados = pontosInfectados.map(p => [p.latitude, p.longitude, p.weight]);
        const arraySaudaveis = pontosSaudaveis.map(p => [p.latitude, p.longitude, p.weight]);

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>
                <style>
                    body, html, #map { margin: 0; padding: 0; height: 100%; width: 100%; background-color: #f5f5f5; }
                    .leaflet-container { background: #f5f5f5 !important; }
                    
                    /* CORREÇÃO DO BUG: Aplica uma transição suave na renderização da camada de calor */
                    .leaflet-heatmap-layer {
                        transition: transform 0.2s ease-out;
                        will-change: transform;
                    }
                </style>
            </head>
            <body>
                <div id="map"></div>
                <script>
                    // Inicialização com animações nativas forçadas como true
                    var map = L.map('map', { 
                        zoomControl: false,
                        maxZoom: 18,
                        minZoom: 3,
                        zoomAnimation: true,
                        fadeAnimation: true
                    }).setView([${centroMapa.latitude}, ${centroMapa.longitude}], 14);
                    
                    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                        subdomains: 'abcd',
                        maxZoom: 20
                    }).addTo(map);

                    var dadosInfectados = ${JSON.stringify(arrayInfectados)};
                    var dadosSaudaveis = ${JSON.stringify(arraySaudaveis)};

                    var camadaInfectados, camadaSaudaveis;

                    // Criação inicial das camadas com o cálculo automático baseado no raio
                    function inicializarCamadas(raio) {
                        if (dadosInfectados.length > 0) {
                            camadaInfectados = L.heatLayer(dadosInfectados, {
                                radius: raio,
                                blur: Math.round(raio * 0.57),
                                maxZoom: 18,
                                minOpacity: 0.45,
                                gradient: { 0.2: '#ffeb3b', 0.6: '#ff9800', 1.0: '#d9534f' }
                            }).addTo(map);
                        }

                        if (dadosSaudaveis.length > 0) {
                            camadaSaudaveis = L.heatLayer(dadosSaudaveis, {
                                radius: raio,
                                blur: Math.round(raio * 0.57),
                                maxZoom: 18,
                                minOpacity: 0.4,
                                gradient: { 0.2: '#a7ffeb', 0.6: '#4fbe37', 1.0: '#1b5e20' }
                            }).addTo(map);
                        }
                    }

                    // Inicializa com o raio base 28
                    inicializarCamadas(28);

                    // CORREÇÃO DO BUG: Escuta os eventos dinâmicos (move e viewreset) para redesenhar sem trancos
                    function atualizarRaioDinamico() {
                        var zoomAtual = map.getZoom();
                        var novoRaio = 28;

                        if (zoomAtual >= 16) {
                            novoRaio = 48;
                        } else if (zoomAtual >= 14) {
                            novoRaio = 28;
                        } else if (zoomAtual >= 12) {
                            novoRaio = 18;
                        } else {
                            novoRaio = 10;
                        }

                        var novoBlur = Math.round(novoRaio * 0.57);

                        if (camadaInfectados) {
                            camadaInfectados.setOptions({ radius: novoRaio, blur: novoBlur });
                        }
                        if (camadaSaudaveis) {
                            camadaSaudaveis.setOptions({ radius: novoRaio, blur: novoBlur });
                        }
                    }

                    // Vincula os gatilhos para atualizar de forma contínua durante o gesto de pinça (zoom)
                    map.on('zoomlevelschange viewreset move', atualizarRaioDinamico);
                </script>
            </body>
            </html>
        `;
    };

    const temPontos = pontosInfectados.length > 0 || pontosSaudaveis.length > 0;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

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
                <View style={styles.mapContainer}>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: gerarHTMLMapa() }}
                        style={styles.map}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' }, 
    mapContainer: { flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height },
    map: { flex: 1 },
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