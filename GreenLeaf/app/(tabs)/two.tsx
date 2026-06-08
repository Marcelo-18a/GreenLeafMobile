import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
    name: string;
    photoUri: string;
}

export default function PrincipalScreen() {
    // Inicializa com um estado padrão seguro para evitar quebras de 'null'
    const [profile, setProfile] = useState<UserProfile>({
        name: 'Produtor GreenLeaf',
        photoUri: ''
    });

    // useFocusEffect atualiza as informações no exato instante em que a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            const carregarDadosPerfil = async () => {
                try {
                    const dadosLocais = await AsyncStorage.getItem('greenleaf_profile');
                    if (dadosLocais) {
                        const perfilConvertido = JSON.parse(dadosLocais);
                        setProfile({
                            name: perfilConvertido.name || 'Produtor GreenLeaf',
                            photoUri: perfilConvertido.photoUri || ''
                        });
                    }
                } catch (error) {
                    console.log("Erro ao carregar dados de perfil na Home:", error);
                }
            };

            carregarDadosPerfil();
        }, [])
    );

    const handleLogout = async () => {
        await AsyncStorage.removeItem('greenleaf_token');
        await AsyncStorage.removeItem('greenleaf_profile');
        router.replace('/');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#57b947" />
            
            {/* CABEÇALHO VERDE ARREDONDADO */}
            <View style={styles.header}>
                <View style={styles.userArea}>
                    <Image 
                        source={
                            profile.photoUri 
                                ? { uri: profile.photoUri } 
                                : require('../../assets/images/greenleaf.png') 
                        } 
                        style={styles.avatar} 
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.greeting}>Olá, bem-vindo!</Text>
                        <Text style={styles.userName} numberOfLines={1}>
                            {profile.name}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* CORPO DO APP - PAINEL DE CONTROLE */}
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.menuTitle}>Painel de Controle</Text>
                
                {/* GRID DE DOIS CARDS BRANCOS (LINHA 1) */}
                <View style={styles.grid}>
                    {/* CARD: NOVA ANÁLISE */}
                    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => router.push('/camera')}>
                        <Ionicons name="camera" size={44} color="#57b947" style={styles.cardIcon} />
                        <Text style={styles.cardText}>Nova Análise</Text>
                    </TouchableOpacity>

                    {/* CARD: HISTÓRICO */}
                    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => router.push('/historico')}>
                        <Ionicons name="trending-up" size={44} color="#57b947" style={styles.cardIcon} />
                        <Text style={styles.cardText}>Histórico</Text>
                    </TouchableOpacity>
                </View>

                {/* NOVO CARD: MAPA DE CALOR (LINHA 2 - CARD DESTAQUE LARGO) */}
                <TouchableOpacity style={styles.wideCard} activeOpacity={0.8} onPress={() => router.push('/mapacalor')}>
                    <View style={styles.wideCardContent}>
                        <Ionicons name="map" size={44} color="#57b947" style={styles.wideCardIcon} />
                        <View style={styles.wideCardTextContainer}>
                            <Text style={styles.wideCardTitle}>Mapa de Calor</Text>
                            <Text style={styles.wideCardSub}>Visualize focos de infecção na lavoura</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    header: {
        height: 150,
        backgroundColor: '#57b947',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    userArea: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1 
    },
    avatar: { 
        width: 64, 
        height: 64, 
        borderRadius: 32, 
        borderWidth: 2, 
        borderColor: '#fff', 
        backgroundColor: '#e1e1e1' 
    },
    textContainer: { 
        marginLeft: 14, 
        flex: 1 
    },
    greeting: { 
        color: '#e0f2f1', 
        fontSize: 14, 
        fontWeight: '500',
        opacity: 0.9
    },
    userName: { 
        color: '#fff', 
        fontSize: 20, 
        fontWeight: '700',
        marginTop: 2
    },
    logoutButton: { 
        width: 44, 
        height: 44, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(255,255,255,0.2)', 
        borderRadius: 22 
    },
    content: { 
        paddingHorizontal: 24, 
        paddingTop: 32,
        paddingBottom: 20
    },
    menuTitle: { 
        fontSize: 22, 
        fontWeight: '700', 
        color: '#2e2e2e', 
        marginBottom: 24 
    },
    grid: { 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginBottom: 16
    },
    card: {
        width: '47%',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardIcon: {
        marginBottom: 14
    },
    cardText: { 
        fontSize: 15, 
        fontWeight: '600', 
        color: '#444',
        textAlign: 'center'
    },
    /* NOVOS ESTILOS DO CARD DO MAPA DE CALOR */
    wideCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginTop: 4
    },
    wideCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    wideCardIcon: {
        marginRight: 16
    },
    wideCardTextContainer: {
        flex: 1
    },
    wideCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#444'
    },
    wideCardSub: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
        fontWeight: '500'
    }
});