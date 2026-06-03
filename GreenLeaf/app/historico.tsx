import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DiagnosticoItem {
    _id: string;
    photoUri: string;
    statusText: string;
    probabilidade: number;
    cor: string;
    descricao: string;
    createdAt: string;
}

const API_URL = 'https://greenleafmobile.onrender.com/api/diagnosticos';

export default function HistoricoScreen() {
    const [historico, setHistorico] = useState<DiagnosticoItem[]>([]);
    const [loading, setLoading] = useState(true);

    const carregarHistorico = async () => {
        try {
            setLoading(true);
            // CORREÇÃO: Resgatando o token com a chave idêntica do seu LoginScreen
            const token = await AsyncStorage.getItem('greenleaf_token'); 
            console.log("Histórico - Token resgatado:", token ? "Token presente" : "Token ausente");
            
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const textoErro = await response.text();
                console.log(`Histórico - Erro no servidor (${response.status}):`, textoErro);
                setHistorico([]);
                return;
            }

            const dados = await response.json();
            setHistorico(Array.isArray(dados) ? dados : []);
        } catch (error) {
            console.log("Histórico - Erro de rede:", error);
            setHistorico([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarHistorico();
    }, []);

    const abrirResultado = (item: DiagnosticoItem) => {
        router.push({
            pathname: "/resultado",
            params: {
                photoUri: item.photoUri,
                mockedStatus: item.statusText,
                mockedProb: String(item.probabilidade),
                mockedCor: item.cor,
                mockedDesc: item.descricao
            }
        });
    };

    const renderCard = ({ item }: { item: DiagnosticoItem }) => {
        const dataFormatada = new Date(item.createdAt).toLocaleDateString('pt-BR');

        return (
            <TouchableOpacity style={styles.card} onPress={() => abrirResultado(item)} activeOpacity={0.7}>
                <Image source={{ uri: item.photoUri }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardData}>{dataFormatada}</Text>
                        <Ionicons name="chevron-forward" size={16} color="#999" />
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: item.cor }]}>
                        <Text style={styles.statusText}>{item.statusText}</Text>
                    </View>
                    <Text style={styles.cardCerteza}>Confiança: {item.probabilidade}%</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#57b947" />
            
            <View style={styles.topHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/principal')}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Meu Histórico</Text>
                <TouchableOpacity style={styles.backButton} onPress={carregarHistorico}>
                    <Ionicons name="refresh" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#5bbb48" />
                    <Text style={styles.loadingText}>Buscando seus dados...</Text>
                </View>
            ) : historico.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="images-outline" size={60} color="#999" />
                    <Text style={styles.emptyText}>Nenhuma análise registrada nesta conta.</Text>
                </View>
            ) : (
                <FlatList
                    data={historico}
                    keyExtractor={(item) => item._id}
                    renderItem={renderCard}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#dcdcdc' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    topHeader: { height: 110, backgroundColor: '#57b947', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 45, elevation: 4 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
    listContainer: { padding: 20 },
    card: { flexDirection: 'row', backgroundColor: '#efefef', borderRadius: 16, marginBottom: 15, overflow: 'hidden', elevation: 3 },
    cardImage: { width: 100, height: 100, resizeMode: 'cover' },
    cardContent: { flex: 1, padding: 12, justifyContent: 'space-between' },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardData: { fontSize: 12, color: '#666', fontWeight: '600' },
    statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, alignSelf: 'flex-start' },
    statusText: { color: '#fff', fontSize: 13, fontWeight: '700' },
    cardCerteza: { fontSize: 13, color: '#444', fontWeight: '500' },
    loadingText: { marginTop: 10, color: '#555', fontWeight: '600' },
    emptyText: { marginTop: 12, color: '#777', fontSize: 16, fontWeight: '500', textAlign: 'center' }
});