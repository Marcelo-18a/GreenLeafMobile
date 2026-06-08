import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator, StatusBar, Alert } from 'react-native';
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
            const token = await AsyncStorage.getItem('greenleaf_token'); 
            
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                setHistorico([]);
                return;
            }

            const dados = await response.json();
            setHistorico(Array.isArray(dados) ? dados : []);
        } catch (error) {
            console.log("Erro de rede:", error);
            setHistorico([]);
        } finally {
            setLoading(false);
        }
    };

    // FUNÇÃO PARA EDITAR O DIAGNÓSTICO
    const handleEditar = async (item: DiagnosticoItem) => {
        // Abre um prompt nativo para o usuário digitar a nova descrição/anotação
        Alert.prompt(
            "Editar Anotação",
            "Modifique a descrição do diagnóstico foliar:",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Salvar",
                    onPress: async (novoTexto) => {
                        if (!novoTexto) return;
                        try {
                            const token = await AsyncStorage.getItem('greenleaf_token');
                            const response = await fetch(`${API_URL}/${item._id}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    statusText: item.statusText, // Mantém o status original da IA
                                    descricao: novoTexto // Altera apenas o texto descritivo
                                })
                            });

                            if (response.ok) {
                                Alert.alert("Sucesso", "Registro atualizado.");
                                carregarHistorico(); // Recarrega a lista instantaneamente
                            } else {
                                Alert.alert("Erro", "Não foi possível salvar as alterações.");
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            ],
            "plain-text",
            item.descricao
        );
    };

    // FUNÇÃO PARA DELETAR O DIAGNÓSTICO
    const handleDeletar = (id: string) => {
        Alert.alert(
            "Excluir Registro",
            "Tem certeza que deseja apagar essa análise do seu histórico definitivamente?",
            [
                { text: "Não", style: "cancel" },
                { 
                    text: "Sim, Excluir", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('greenleaf_token');
                            const response = await fetch(`${API_URL}/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            if (response.ok) {
                                Alert.alert("Removido", "O diagnóstico foi excluído do banco.");
                                carregarHistorico(); // Atualiza a lista na hora
                            } else {
                                Alert.alert("Erro", "Não foi possível deletar.");
                            }
                        } catch (err) {
                            console.log("Erro ao deletar:", err);
                        }
                    }
                }
            ]
        );
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
            <View style={styles.cardContainer}>
                <TouchableOpacity style={styles.cardMain} onPress={() => abrirResultado(item)} activeOpacity={0.7}>
                    <Image source={{ uri: item.photoUri }} style={styles.cardImage} />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardData}>{dataFormatada}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: item.cor }]}>
                            <Text style={styles.statusText}>{item.statusText}</Text>
                        </View>
                        <Text style={styles.cardCerteza} numberOfLines={1}>Confiança: {item.probabilidade}%</Text>
                    </View>
                </TouchableOpacity>

                {/* PAINEL LATERAL DE AÇÕES (EDITAR/DELETAR) */}
                <View style={styles.actionPanel}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleEditar(item)}>
                        <Ionicons name="pencil" size={18} color="#57b947" />
                    </TouchableOpacity>
                    <View style={styles.actionDivider} />
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleDeletar(item._id)}>
                        <Ionicons name="trash" size={18} color="#d9534f" />
                    </TouchableOpacity>
                </View>
            </View>
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
    listContainer: { padding: 16 },
    
    /* ESTRUTURA DOS NOVOS CARDS INTEGRADOS */
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: '#efefef',
        borderRadius: 16,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2.22,
    },
    cardMain: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    cardImage: { width: 95, height: 95, resizeMode: 'cover' },
    cardContent: { flex: 1, padding: 10, justifyContent: 'space-between', height: 95 },
    cardData: { fontSize: 11, color: '#666', fontWeight: '600' },
    statusBadge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 10, alignSelf: 'flex-start' },
    statusText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    cardCerteza: { fontSize: 12, color: '#444', fontWeight: '500', marginTop: 2 },
    
    /* ESTILOS DOS BOTÕES DE DELETAR E EDITAR */
    actionPanel: {
        width: 48,
        backgroundColor: '#fff',
        borderLeftWidth: 1,
        borderLeftColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButton: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionDivider: {
        width: '60%',
        height: 1,
        backgroundColor: '#eee'
    },
    loadingText: { marginTop: 10, color: '#555', fontWeight: '600' },
    emptyText: { marginTop: 12, color: '#777', fontSize: 16, fontWeight: '500', textAlign: 'center' }
});