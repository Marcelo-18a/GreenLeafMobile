import React, { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Estrutura técnica de dados focada em Xanthomonas phaseoli pv. manihotis
const faqData = [
    {
        id: '1',
        pergunta: 'O que é a Xanthomonas (Bacteriose)?',
        resposta: 'É uma doença devastadora causada pela bactéria Xanthomonas phaseoli pv. manihotis. Ela penetra pelos estômatos ou ferimentos da folha da mandioca, coloniza os vasos condutores de seiva (xilema) e pode causar a murcha total e morte da planta.'
    },
    {
        id: '2',
        pergunta: 'Quais os sintomas visuais nas folhas?',
        resposta: 'Os principais sinais são as "manchas angulares" com aspecto encharcado (parecem úmidas). Com o avanço da infecção, ocorre a queima de folhas, exsudação de goma bacteriana na parte inferior e a desfolha (queda) começando de baixo para cima.'
    },
    {
        id: '3',
        pergunta: 'Como o GreenLeaf identifica a doença?',
        resposta: 'O aplicativo utiliza redes neurais convolucionais (Deep Learning) treinadas especificamente para reconhecer a geometria angular e a coloração necrótica das lesões da Xanthomonas, separando tecidos saudáveis de infectados instantaneamente.'
    },
    {
        id: '4',
        pergunta: 'O que fazer ao detectar um foco?',
        resposta: 'É altamente recomendado erradicar e queimar as plantas infectadas para conter o contágio. Para os próximos plantios, utilize estacas (manivas) com certificação de sanidade fitossanitária e evite ferramentas compartilhadas sem desinfecção.'
    },
    {
        id: '5',
        pergunta: 'Como funciona o mapa de calor do app?',
        resposta: 'Sempre que um diagnóstico aponta "Bacteriose Detectada", o app vincula os dados geométricos à coordenada GPS capturada pelo hardware do celular. Isso gera a densidade de focos acumulada no mapa para gestão de risco.'
    }
];

type AccordionItemProps = {
    pergunta: string;
    resposta: string;
    isOpen: boolean;
    onToggle: () => void;
};

function AccordionItem({ pergunta, resposta, isOpen, onToggle }: AccordionItemProps) {
    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.cardHeader} activeOpacity={0.7} onPress={onToggle}>
                <Text style={styles.cardTitle}>{pergunta}</Text>
                <Ionicons 
                    name={isOpen ? "chevron-up-circle" : "chevron-down-circle"} 
                    size={26} 
                    color="#57b947" 
                />
            </TouchableOpacity>
            
            {isOpen && (
                <View style={styles.cardContent}>
                    <Text style={styles.cardText}>{resposta}</Text>
                </View>
            )}
        </View>
    );
}

export default function DuvidasScreen() {
    // Estado para rastrear qual ID de pergunta está aberto (null se nenhum estiver)
    const [openedId, setOpenedId] = useState<string | null>('1'); // Deixa a primeira aberta por padrão

    const toggleAccordion = (id: string) => {
        setOpenedId(openedId === id ? null : id);
    };

    return (
        <SafeAreaView style={styles.screen}>
            {/* TOPO COM LOGO INTEGRADA */}
            <View style={styles.header}>
                <Image source={require('../assets/images/greenleaf.png')} style={styles.logo} resizeMode="contain" />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* BOTÃO VOLTAR INTEGRADO AO DESIGN */}
                <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={styles.backRow}>
                    <Ionicons name="arrow-back" size={20} color="#4d4d4d" />
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Dúvidas Frequentes</Text>
                <Text style={styles.subtitle}>Consulte informações fitossanitárias básicas para manejo e controle da cultura.</Text>

                {/* LISTAGEM DOS ACCORDIONS */}
                <View style={styles.faqList}>
                    {faqData.map((item) => (
                        <AccordionItem
                            key={item.id}
                            pergunta={item.pergunta}
                            resposta={item.resposta}
                            isOpen={openedId === item.id}
                            onToggle={() => toggleAccordion(item.id)}
                        />
                    ))}
                </View>

                {/* NOTA DE SUPORTE */}
                <View style={styles.footerNote}>
                    <Ionicons name="shield-checkmark" size={24} color="#57b947" />
                    <Text style={styles.footerNoteText}>
                        Caso encontre anomalias severas não descritas, utilize o menu de Suporte para acionar assistência técnica qualificada.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#dcdcdc' }, // Ajustado para dar consistência ao fundo cinza do app
    header: {
        height: 120,
        backgroundColor: '#57b947',
        borderBottomRightRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
    },
    logo: { width: 172, height: 56, marginTop: 12 },
    content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30 },
    backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 6, marginBottom: 10 },
    backText: { fontSize: 16, color: '#4d4d4d', fontWeight: '600' },
    title: { fontSize: 32, fontWeight: '700', color: '#474747', marginBottom: 6 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 },
    faqList: { gap: 12 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 18,
        minHeight: 64,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4a4a4a',
        flex: 1,
        paddingRight: 10,
    },
    cardContent: {
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 18,
        paddingBottom: 18,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    cardText: {
        fontSize: 15,
        color: '#5a5a5a',
        lineHeight: 22,
        marginTop: 12,
    },
    footerNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginTop: 26,
        gap: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#57b947'
    },
    footerNoteText: {
        flex: 1,
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    }
});