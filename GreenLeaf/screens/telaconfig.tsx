import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useResponsiveLayout } from './useResponsiveLayout';

type ConfigRowProps = {
    iconName: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    onPress?: () => void;
};

function ConfigRow({ iconName, label, onPress }: ConfigRowProps) {
    return (
        <TouchableOpacity style={styles.row} activeOpacity={0.85} onPress={onPress}>
            <View style={styles.rowLeft}>
                <Ionicons name={iconName} size={28} color="#4f4f4f" />
                <Text style={styles.rowLabel}>{label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#4f4f4f" />
        </TouchableOpacity>
    );
}

export default function TelaConfigScreen() {
    const { compact } = useResponsiveLayout();
    const insets = useSafeAreaInsets();

    // ESTADOS PARA OS MODAIS
    const [modalAcessibilidade, setModalAcessibilidade] = useState(false);
    const [modalPrivacidade, setModalPrivacidade] = useState(false);

    // ESTADOS DAS CONFIGURAÇÕES
    const [fonteGrande, setFonteGrande] = useState(false);
    const [altoContraste, setAltoContraste] = useState(false);
    const [gpsAtivo, setGpsAtivo] = useState(true);
    const [compartilharDados, setCompartilharDados] = useState(true);

    // CHAVES DO ASYNC STORAGE
    const STORAGE_GALERIA = '@greenleaf_galeria_fotos';
    const KEY_GPS = '@greenleaf_config_gps';

    // 1. CARREGA AS PREFERÊNCIAS SALVAS DO CELULAR QUANDO A TELA ABRE
    useEffect(() => {
        const carregarConfiguracoes = async () => {
            try {
                const valorGps = await AsyncStorage.getItem(KEY_GPS);
                if (valorGps !== null) {
                    setGpsAtivo(JSON.parse(valorGps));
                }
                
                const valorFonte = await AsyncStorage.getItem('@greenleaf_config_fonte');
                if (valorFonte !== null) setFonteGrande(JSON.parse(valorFonte));

                const valorContraste = await AsyncStorage.getItem('@greenleaf_config_contraste');
                if (valorContraste !== null) setAltoContraste(JSON.parse(valorContraste));

                const valorDados = await AsyncStorage.getItem('@greenleaf_config_dados');
                if (valorDados !== null) setCompartilharDados(JSON.parse(valorDados));
            } catch (error) {
                console.log("Erro ao carregar configurações:", error);
            }
        };

        carregarConfiguracoes();
    }, []);

    // 2. FUNÇÕES PARA SALVAR AS MUDANÇAS EM TEMPO REAL
    const alternarGps = async (valor: boolean) => {
        setGpsAtivo(valor);
        try {
            // Salva a preferência do GPS (A tela app/camera.tsx vai ler isso!)
            await AsyncStorage.setItem(KEY_GPS, JSON.stringify(valor));
        } catch (error) {
            console.log("Erro ao salvar config de GPS:", error);
        }
    };

    const alternarFonte = async (valor: boolean) => {
        setFonteGrande(valor);
        try {
            await AsyncStorage.setItem('@greenleaf_config_fonte', JSON.stringify(valor));
        } catch (error) {
            console.log(error);
        }
    };

    const alternarContraste = async (valor: boolean) => {
        setAltoContraste(valor);
        try {
            await AsyncStorage.setItem('@greenleaf_config_contraste', JSON.stringify(valor));
        } catch (error) {
            console.log(error);
        }
    };

    const alternarCompartilharDados = async (valor: boolean) => {
        setCompartilharDados(valor);
        try {
            await AsyncStorage.setItem('@greenleaf_config_dados', JSON.stringify(valor));
        } catch (error) {
            console.log(error);
        }
    };

    // 3. LIMPA OS DADOS DA GALERIA DE VERDADE
    const handleLimparHistorico = () => {
        Alert.alert(
            "Limpar Galeria",
            "Tem certeza que deseja apagar permanentemente todas as fotos salvas na sua galeria local do GreenLeaf?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Apagar Tudo", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            // Deleta a chave do banco de dados local do celular
                            await AsyncStorage.removeItem(STORAGE_GALERIA);
                            Alert.alert("Sucesso", "A sua galeria de fotos local foi limpa com sucesso!");
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível limpar as fotos.");
                        }
                    } 
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={[styles.header, compact && styles.headerCompact]}>
                <Image source={require('../assets/images/greenleaf.png')} style={[styles.logo, compact && styles.logoCompact]} resizeMode="contain" />
            </View>

            <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, compact && styles.titleCompact]}>Configurações</Text>

                <View style={[styles.rows, compact && styles.rowsCompact]}>
                    <ConfigRow iconName="person" label="Perfil" onPress={() => router.push('/perfil')} />
                    <ConfigRow iconName="eye" label="Acessibilidade" onPress={() => setModalAcessibilidade(true)} />
                    <ConfigRow iconName="lock-closed" label="Privacidade" onPress={() => setModalPrivacidade(true)} />
                    <ConfigRow iconName="headset" label="Suporte" onPress={() => router.push('/telasuporte')} />
                    <ConfigRow iconName="help-circle" label="Dúvidas" onPress={() => router.push('/duvidas')} />
                </View>
            </ScrollView>

            {/* MODAL DE ACESSIBILIDADE */}
            <Modal animationType="slide" transparent={true} visible={modalAcessibilidade} onRequestClose={() => setModalAcessibilidade(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Ionicons name="eye" size={28} color="#fff" />
                            <Text style={styles.modalHeaderTitle}>Acessibilidade</Text>
                            <TouchableOpacity onPress={() => setModalAcessibilidade(false)}>
                                <Ionicons name="close" size={28} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.modalDescription}>Ajustes focados na leitura das informações em campo sob luz intensa solar.</Text>
                            
                            <View style={styles.optionItem}>
                                <View style={styles.optionTextContainer}>
                                    <Text style={styles.optionTitle}>Ampliar Fontes</Text>
                                    <Text style={styles.optionSub}>Aumenta o texto para melhor leitura dos laudos técnicos.</Text>
                                </View>
                                <Switch value={fonteGrande} onValueChange={alternarFonte} trackColor={{ false: '#767577', true: '#5bbb48' }} thumbColor="#fff" />
                            </View>

                            <View style={styles.optionItem}>
                                <View style={styles.optionTextContainer}>
                                    <Text style={styles.optionTitle}>Alto Contraste</Text>
                                    <Text style={styles.optionSub}>Otimiza as cores sob luz do dia.</Text>
                                </View>
                                <Switch value={altoContraste} onValueChange={alternarContraste} trackColor={{ false: '#767577', true: '#5bbb48' }} thumbColor="#fff" />
                            </View>

                            <View style={styles.infoBlock}>
                                <Ionicons name="volume-high" size={24} color="#5a5a5a" />
                                <Text style={styles.infoBlockText}>O GreenLeaf é totalmente compatível com leitores de tela nativos (TalkBack e VoiceOver) para leitura de laudos fitossanitários por voz.</Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* MODAL DE PRIVACIDADE */}
            <Modal animationType="slide" transparent={true} visible={modalPrivacidade} onRequestClose={() => setModalPrivacidade(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Ionicons name="lock-closed" size={26} color="#fff" />
                            <Text style={styles.modalHeaderTitle}>Privacidade</Text>
                            <TouchableOpacity onPress={() => setModalPrivacidade(false)}>
                                <Ionicons name="close" size={28} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.modalDescription}>Controle as permissões de hardware e a segurança dos dados geográficos da propriedade rural.</Text>
                            
                            <View style={styles.optionItem}>
                                <View style={styles.optionTextContainer}>
                                    <Text style={styles.optionTitle}>Localização GPS</Text>
                                    <Text style={styles.optionSub}>Permite mapear focos de bacteriose no mapa de calor da lavoura.</Text>
                                </View>
                                <Switch value={gpsAtivo} onValueChange={alternarGps} trackColor={{ false: '#767577', true: '#5bbb48' }} thumbColor="#fff" />
                            </View>

                            <View style={styles.optionItem}>
                                <View style={styles.optionTextContainer}>
                                    <Text style={styles.optionTitle}>Análise de Dados</Text>
                                    <Text style={styles.optionSub}>Compartilhar imagens anonimamente para melhoria contínua da inteligência artificial.</Text>
                                </View>
                                <Switch value={compartilharDados} onValueChange={alternarCompartilharDados} trackColor={{ false: '#767577', true: '#5bbb48' }} thumbColor="#fff" />
                            </View>

                            <TouchableOpacity style={styles.actionButton} onPress={handleLimparHistorico} activeOpacity={0.8}>
                                <Ionicons name="trash-outline" size={22} color="#d9534f" />
                                <Text style={styles.actionButtonText}>Limpar Histórico de Imagens da Galeria</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* NAVEGAÇÃO DE RODAPÉ */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8, height: 82 + insets.bottom }]}>
                <TouchableOpacity style={styles.navItem} activeOpacity={0.75} onPress={() => router.replace('/principal')}>
                    <View style={styles.iconWrap}>
                        <Ionicons name="home" size={36} color="#5bbb48" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} activeOpacity={0.75} onPress={() => router.push('/galeria')}>
                    <View style={styles.iconWrap}>
                        <Ionicons name="archive" size={32} color="#5bbb48" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} activeOpacity={0.75} onPress={() => router.push('/telasuporte')}>
                    <View style={styles.iconWrap}>
                        <MaterialCommunityIcons name="headset" size={32} color="#5bbb48" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} activeOpacity={0.75}>
                    <View style={styles.iconWrap}>
                        <Ionicons name="settings" size={32} color="#5bbb48" />
                    </View>
                    <View style={styles.activeDot} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#dcdcdc' },
    header: { height: 120, backgroundColor: '#57b947', borderBottomRightRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 4 },
    logo: { width: 172, height: 56, marginTop: 12 },
    headerCompact: { height: 82 },
    logoCompact: { width: 160, height: 52, marginTop: 12 },
    content: { flexGrow: 1, paddingTop: 26, paddingHorizontal: 24, paddingBottom: 16 },
    contentCompact: { paddingTop: 18, paddingHorizontal: 18 },
    title: { fontSize: 40, color: '#474747', fontWeight: '700', textAlign: 'left', marginBottom: 24 },
    titleCompact: { fontSize: 32, marginBottom: 18 },
    rows: { gap: 10 },
    rowsCompact: { gap: 8 },
    row: { minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10 },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    rowLabel: { fontSize: 24, color: '#5a5a5a', fontWeight: '500' },
    bottomBar: { borderTopWidth: 1, borderTopColor: '#b8b8b8', backgroundColor: '#ededed', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.16, shadowRadius: 2, elevation: 9 },
    navItem: { alignItems: 'center', justifyContent: 'center', minWidth: 54, position: 'relative' },
    iconWrap: { alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 8, backgroundColor: 'transparent', marginBottom: 8 },
    activeDot: { position: 'absolute', bottom: 8, left: '50%', marginLeft: -3, width: 6, height: 6, borderRadius: 3, backgroundColor: '#5bbb48' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%' },
    modalHeader: { backgroundColor: '#57b947', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
    modalHeaderTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
    modalBody: { padding: 24 },
    modalDescription: { fontSize: 15, color: '#777', marginBottom: 20, lineHeight: 22 },
    optionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    optionTextContainer: { flex: 1, paddingRight: 16 },
    optionTitle: { fontSize: 18, fontWeight: '600', color: '#474747' },
    optionSub: { fontSize: 13, color: '#888', marginTop: 2 },
    infoBlock: { flexDirection: 'row', backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, marginTop: 24, gap: 12, alignItems: 'center', marginBottom: 30 },
    infoBlockText: { flex: 1, fontSize: 13, color: '#666', lineHeight: 18 },
    actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderWidth: 1, borderColor: '#d9534f', borderRadius: 12, marginTop: 16, marginBottom: 40 },
    actionButtonText: { color: '#d9534f', fontSize: 15, fontWeight: '600' }
});