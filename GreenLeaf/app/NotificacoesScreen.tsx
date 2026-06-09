import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';

interface Notificacao {
    _id: string;
    tipo: 'suporte' | 'campo' | 'alerta';
    titulo: string;
    mensagem: string;
    createdAt: string;
    lida: boolean;
}

export default function NotificacoesScreen() {
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [loading, setLoading] = useState(true);

    // Carregar notificações do MongoDB
    const fetchNotifications = async () => {
        try {
            const token = await AsyncStorage.getItem('greenleaf_token');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/users/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setNotificacoes(data);
            }
        } catch (error) {
            console.error('Erro ao buscar notificações da API:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // Marcar uma notificação no banco como lida
    const marcarComoLida = async (id: string) => {
        // Atualiza a interface imediatamente
        setNotificacoes(prev =>
            prev.map(notif => (notif._id === id ? { ...notif, lida: true } : notif))
        );

        try {
            const token = await AsyncStorage.getItem('greenleaf_token');
            await fetch(`${API_BASE_URL}/api/users/notifications/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Marcar todas do banco como lidas
    const marcarTodasComoLidas = async () => {
        setNotificacoes(prev => prev.map(notif => ({ ...notif, lida: true })));

        try {
            const token = await AsyncStorage.getItem('greenleaf_token');
            await fetch(`${API_BASE_URL}/api/users/notifications/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const renderIcon = (tipo: string) => {
        switch (tipo) {
            case 'alerta': return <Ionicons name="warning" size={22} color="#d93838" />;
            case 'suporte': return <Ionicons name="chatbubble-ellipses" size={22} color="#444444" />;
            case 'campo': return <Ionicons name="leaf" size={22} color="#57b947" />;
            default: return <Ionicons name="notifications" size={22} color="#555" />;
        }
    };

    const formatarData = (stringData: string) => {
        try {
            const d = new Date(stringData);
            return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        } catch {
            return 'Agora';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#57b947" />
            
            {/* 🛑 REMOVE COMPLETAMENTE A BARRA PRETA DE CABEÇALHO DUPLICADO DA IMAGE_1B0E63.PNG */}
            <Stack.Screen options={{ headerShown: false }} />

            {/* HEADER COM BOTÃO DE VOLTAR */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </TouchableOpacity>
                <Image source={require('../assets/images/greenleaf.png')} style={styles.logo} />
            </View>

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={styles.mainTitle}>Notificações</Text>
                    {notificacoes.length > 0 && (
                        <TouchableOpacity onPress={marcarTodasComoLidas}>
                            <Text style={styles.clearAllText}>Limpar não lidas</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#57b947" style={{ marginTop: 40 }} />
                ) : notificacoes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={48} color="#aaa" />
                        <Text style={styles.emptyText}>Nenhuma notificação por aqui.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={notificacoes}
                        keyExtractor={item => item._id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={[styles.card, !item.lida && styles.cardNaoLido]} 
                                onPress={() => marcarComoLida(item._id)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.iconContainer}>
                                    {renderIcon(item.tipo)}
                                    {!item.lida && <View style={styles.badgeNaoLido} />}
                                </View>
                                
                                <View style={styles.textContainer}>
                                    <View style={styles.cardHeaderRow}>
                                        <Text style={[styles.cardTitle, !item.lida && styles.textBold]}>{item.titulo}</Text>
                                        <Text style={styles.cardData}>{formatarData(item.createdAt)}</Text>
                                    </View>
                                    <Text style={styles.cardMensagem}>{item.mensagem}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { height: 120, backgroundColor: '#57b947', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, position: 'relative' },
    backButton: { position: 'absolute', left: 20, top: 48, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
    logo: { width: 160, height: 50, resizeMode: 'contain', marginTop: 15 },
    content: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    mainTitle: { fontSize: 24, fontWeight: '700', color: '#333' },
    clearAllText: { fontSize: 14, color: '#57b947', fontWeight: '600' },
    card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    cardNaoLido: { backgroundColor: '#f1fcf0', borderLeftWidth: 4, borderLeftColor: '#57b947' },
    iconContainer: { marginRight: 12, justifyContent: 'center', alignItems: 'center', position: 'relative', width: 30 },
    badgeNaoLido: { position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#57b947' },
    textContainer: { flex: 1 },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    cardTitle: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1, paddingRight: 8 },
    textBold: { fontWeight: '700', color: '#111' },
    cardData: { fontSize: 12, color: '#999' },
    cardMensagem: { fontSize: 13, color: '#666', lineHeight: 18 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60, gap: 10 },
    emptyText: { fontSize: 16, color: '#888', fontWeight: '500' }
});