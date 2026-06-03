import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, StatusBar } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ResultadoScreen() {
    const params = useLocalSearchParams();
    
    const photoUri = params.photoUri as string;
    const statusText = (params.mockedStatus as string) || 'Nenhuma Bacteriose Encontrada';
    const probabilidade = parseInt((params.mockedProb as string) || '90', 10);
    const badgeColor = (params.mockedCor as string) || '#5bbb48';
    const descricao = (params.mockedDesc as string) || 'A análise da estrutura foliar não indicou anomalias fitossanitárias.';

    const éBacteriose = statusText.includes('Bacteriose');
    const recomendacoes = éBacteriose 
        ? [
            'Identificar e erradicar (arrancar e queimar) as plantas com sintomas iniciais.',
            'Desinfetar ferramentas de poda com hipoclorito de sódio entre as linhas de plantio.',
            'Evitar o trânsito de pessoas e maquinário na lavoura enquanto as folhas estiverem úmidas.',
            'Para os próximos plantios, selecionar estacas/manivas estritamente saudáveis.'
          ]
        : [
            'Manter o monitoramento periódico visual (inspeções semanais) na área.',
            'Garantir a adubação equilibrada com potássio, que auxilia na resistência natural da planta.',
            'Manter a área livre de plantas daninhas hospedeiras próximas à cultura.'
          ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <View style={styles.topHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Análise da Folha</Text>
                <View style={styles.placeholderView} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.photoCard}>
                    {photoUri ? (
                        <Image source={{ uri: photoUri }} style={styles.analysedPhoto} />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <MaterialCommunityIcons name="leaf" size={48} color="#b8b8b8" />
                            <Text style={styles.photoPlaceholderText}>Foto indisponível</Text>
                        </View>
                    )}
                    <View style={styles.photoTag}>
                        <Ionicons name="scan-circle" size={18} color="#fff" />
                        <Text style={styles.photoTagText}>Registro de Análise</Text>
                    </View>
                </View>

                <View style={styles.resultBlock}>
                    <Text style={styles.blockLabel}>Diagnóstico da I.A.:</Text>
                    <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}>
                        <Text style={styles.statusText}>{statusText}</Text>
                    </View>

                    <View style={styles.gaugeContainer}>
                        <View style={[styles.circleOuter, { borderColor: badgeColor }]}>
                            <Text style={[styles.gaugePercentage, { color: badgeColor }]}>{probabilidade}%</Text>
                            <Text style={styles.gaugeLabel}>Confiança do Modelo</Text>
                        </View>
                    </View>

                    <Text style={styles.descriptionText}>{descricao}</Text>
                </View>

                <View style={styles.recommendationBlock}>
                    <View style={styles.recommendationHeader}>
                        <MaterialCommunityIcons name="clipboard-check-outline" size={22} color="#4a4a4a" />
                        <Text style={styles.recommendationTitle}>Medidas de Manejo Agrícola</Text>
                    </View>
                    
                    {recomendacoes.map((item, index) => (
                        <View key={index} style={styles.bulletRow}>
                            <View style={[styles.bulletPoint, { backgroundColor: badgeColor }]} />
                            <Text style={styles.bulletText}>{item}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.doneButton} activeOpacity={0.85} onPress={() => router.replace('/principal')}>
                    <Text style={styles.doneButtonText}>Voltar ao Menu</Text>
                    <Ionicons name="checkmark-circle-outline" size={22} color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#dcdcdc' },
    topHeader: { height: 110, backgroundColor: '#57b947', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 45, elevation: 4, zIndex: 10 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center' },
    placeholderView: { width: 40 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    photoCard: { width: '100%', height: 200, borderRadius: 20, backgroundColor: '#efefef', overflow: 'hidden', elevation: 4, marginBottom: 20 },
    analysedPhoto: { width: '100%', height: '100%', resizeMode: 'cover' },
    photoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    photoPlaceholderText: { fontSize: 14, color: '#888', marginTop: 8, fontWeight: '500' },
    photoTag: { position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 },
    photoTagText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    resultBlock: { backgroundColor: '#efefef', borderRadius: 20, padding: 20, alignItems: 'center', elevation: 4, marginBottom: 20 },
    blockLabel: { fontSize: 14, color: '#666', fontWeight: '600', marginBottom: 8, alignSelf: 'flex-start' },
    statusBadge: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 25, marginBottom: 20, elevation: 3 },
    statusText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
    gaugeContainer: { justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    circleOuter: { width: 130, height: 130, borderRadius: 65, borderWidth: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 2 },
    gaugePercentage: { fontSize: 32, fontWeight: '800' },
    gaugeLabel: { fontSize: 11, color: '#777', fontWeight: '500', marginTop: 2 },
    descriptionText: { fontSize: 15, color: '#444', textAlign: 'center', lineHeight: 22, fontWeight: '500', paddingHorizontal: 6 },
    recommendationBlock: { backgroundColor: '#efefef', borderRadius: 20, padding: 20, elevation: 4, marginBottom: 24 },
    recommendationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#dcdcdc', paddingBottom: 10 },
    recommendationTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
    bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, paddingRight: 10 },
    bulletPoint: { width: 8, height: 8, borderRadius: 4, marginTop: 6, marginRight: 10 },
    bulletText: { flex: 1, fontSize: 14, color: '#555', lineHeight: 20, fontWeight: '500' },
    doneButton: { width: '100%', height: 52, backgroundColor: '#4e4f52', borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', elevation: 4 },
    doneButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' }
});