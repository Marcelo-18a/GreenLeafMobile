import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Interface para estruturar as notificações
interface Notificacao {
    id: string;
    tipo: 'suporte' | 'campo' | 'alerta';
    titulo: string;
    mensagem: string;
    data: string;
    lida: boolean;
}

export default function NotificacoesScreen() {
    // Dados simulados baseados nas suas ideias e na lavoura de mandioca
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([
        {
            id: '1',
            tipo: 'alerta',
            titulo: '⚠️ Alerta de Fitossanidade',
            mensagem: 'Análise concluída: Sinais iniciais de Xanthomonas phaseoli (Bacteriose) foram detectados na última imagem enviada. Verifique as medidas de manejo recomendado.',
            data: 'Hoje, 14:30',
            lida: false,
        },
        {
            id: '2',
            tipo: 'suporte',
            titulo: '💬 Retorno do Suporte Técnico',
            mensagem: 'A equipe GreenLeaf respondeu ao seu chamado técnico! Verifique a caixa de entrada do seu e-mail cadastrado para seguir as instruções de correção enviadas.',
            data: 'Hoje, 11:15',
            lida: false,
        },
        {
            id: '3',
            tipo: 'campo',
            titulo: '📅 Lembrete de Manejo',
            mensagem: 'Aviso de campo: Condições climáticas na região de Pariquera-Açu favorecem o aparecimento de pragas. Monitore as brotas novas da sua plantação de mandioca.',
            data: 'Ontem, 16:45',
            lida: true,
        },
        {
            id: '4',
            tipo: 'suporte',
            titulo: '✅ Chamado Encerrado',
            mensagem: 'Seu chamado anterior sobre problemas de login no aplicativo foi marcado como resolvido. Obrigado pelo feedback!',
            data: '07 Jun',
            lida: true,
        },
    ]);

    // Marcar uma notificação específica como lida
    const marcarComoLida = (id: string) => {
        setNotificacoes(prev =>
            prev.map(notif => (notif.id === id ? { ...notif, lida: true } : notif))
        );
    };

    // Marcar todas as notificações como lidas de uma vez
    const marcarTodasComoLidas = () => {
        setNotificacoes(prev => prev.map(notif => ({ ...notif, lida: true })));
    };

    // Função para renderizar o ícone correto baseado no tipo
    const renderIcon = (tipo: string) => {
        switch (tipo) {
            case 'alerta': return <Ionicons name="warning" size={22} color="#d93838" />;
            case 'suporte': return <Ionicons name="chatbubble-ellipses" size={22} color="#444444" />;
            case 'campo': return <Ionicons name="leaf" size={22} color="#57b947" />;
            default: return <Ionicons name="notifications" size={22} color="#555" />;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#57b947" />

            {/* HEADER PADRÃO GREENLEAF */}
            <View style={styles.header}>
                <Image 
                    source={require('../assets/images/greenleaf.png')} 
                    style={styles.logo} 
                />
            </View>

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={styles.mainTitle}>Notificações</Text>
                    <TouchableOpacity onPress={marcarTodasComoLidas}>
                        <Text style={styles.clearAllText}>Limpar não lidas</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={notificacoes}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={[styles.card, !item.lida && styles.cardNaoLido]} 
                            onPress={() => marcarComoLida(item.id)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.iconContainer}>
                                {renderIcon(item.tipo)}
                                {!item.lida && <View style={styles.badgeNaoLido} />}
                            </View>
                            
                            <View style={styles.textContainer}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={[styles.cardTitle, !item.lida && styles.textBold]}>{item.titulo}</Text>
                                    <Text style={styles.cardData}>{item.data}</Text>
                                </View>
                                <Text style={styles.cardMensagem} numberOfLines={3}>{item.mensagem}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        height: 120,
        backgroundColor: '#57b947',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    logo: { width: 180, height: 50, resizeMode: 'contain', marginTop: 15 },
    content: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    mainTitle: { fontSize: 24, fontWeight: '700', color: '#333' },
    clearAllText: { fontSize: 14, color: '#57b947', fontWeight: '600' },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardNaoLido: {
        backgroundColor: '#f1fcf0', // Destaque sutil esverdeado para novos alertas
        borderLeftWidth: 4,
        borderLeftColor: '#57b947',
    },
    iconContainer: { marginRight: 12, justifyContent: 'center', alignItems: 'center', position: 'relative', width: 30 },
    badgeNaoLido: { position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#57b947' },
    textContainer: { flex: 1 },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    cardTitle: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1, paddingRight: 8 },
    textBold: { fontWeight: '700', color: '#111' },
    cardData: { fontSize: 12, color: '#999' },
    cardMensagem: { fontSize: 13, color: '#666', lineHeight: 18 },
});