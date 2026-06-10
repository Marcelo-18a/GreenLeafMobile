import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FotoLocal {
    id: string;
    uri: string;
}

const { width } = Dimensions.get('window');
const COLUMN_SIZE = width / 3 - 15; 
const STORAGE_KEY = '@greenleaf_galeria_fotos';

export default function GaleriaScreen() {
    const [fotos, setFotos] = useState<FotoLocal[]>([]);
    const [carregandoFotos, setCarregandoFotos] = useState(true);

    // 1. CARREGA AS FOTOS SALVAS ASSIM QUE ABRE A TELA
    useEffect(() => {
        const carregarFotosSalvas = async () => {
            try {
                const fotosSalvas = await AsyncStorage.getItem(STORAGE_KEY);
                if (fotosSalvas) {
                    setFotos(JSON.parse(fotosSalvas));
                }
            } catch (error) {
                console.log("Erro ao carregar fotos do armazenamento:", error);
            } finally {
                setCarregandoFotos(false);
            }
        };

        carregarFotosSalvas();
    }, []);

    // 2. FUNÇÃO PARA SELECIONAR E SALVAR A FOTO
    const selecionarFotoDaGaleria = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos.');
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
            const novaFoto: FotoLocal = {
                id: Date.now().toString(),
                uri: resultado.assets[0].uri 
            };

            const listaAtualizada = [novaFoto, ...fotos];
            setFotos(listaAtualizada);

            // SALVA A LISTA ATUALIZADA NO ARMAZENAMENTO DO CELULAR
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
            } catch (error) {
                console.log("Erro ao salvar foto na memória:", error);
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* CABEÇALHO */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Minha Galeria</Text>
                
                <TouchableOpacity onPress={selecionarFotoDaGaleria} style={styles.addButton}>
                    <Ionicons name="add" size={24} color="#57b947" />
                </TouchableOpacity>
            </View>

            {/* CORPO DA TELA */}
            {carregandoFotos ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#57b947" />
                    <Text style={styles.loadingText}>Carregando arquivos...</Text>
                </View>
            ) : fotos.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="images-outline" size={60} color="#ccc" />
                    <Text style={styles.emptyText}>Nenhuma foto adicionada ainda.</Text>
                    <TouchableOpacity style={styles.emptyButton} onPress={selecionarFotoDaGaleria}>
                        <Text style={styles.emptyButtonText}>Selecionar do Celular</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={fotos}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    contentContainerStyle={styles.gridContainer}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.wrapperImagem} 
                            activeOpacity={0.9}
                            onPress={() => {
                                Alert.alert(
                                    "Análise de Imagem", 
                                    "Deseja enviar esta foto da folha para o sistema de diagnóstico de bacteriose?",
                                    [
                                        {
                                            text: "Cancelar",
                                            style: "cancel"
                                        },
                                        {
                                            text: "Sim, Analisar",
                                            onPress: () => {
                                                // Corrigido para mandar para '/camera' com o parâmetro certo
                                                router.push({
                                                    pathname: '/camera', 
                                                    params: { imagemSelecionada: item.uri }
                                                });
                                            }
                                        }
                                    ]
                                );
                            }}
                        >
                            <Image source={{ uri: item.uri }} style={styles.imagem} />
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: { padding: 5 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    addButton: { padding: 5 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    
    gridContainer: { padding: 10 },
    wrapperImagem: {
        margin: 5,
        width: COLUMN_SIZE,
        height: COLUMN_SIZE,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#eee'
    },
    imagem: { width: '100%', height: '100%' },
    
    loadingText: { marginTop: 10, fontSize: 14, color: '#666' },
    emptyText: { marginTop: 10, fontSize: 16, color: '#999', textAlign: 'center' },
    emptyButton: {
        marginTop: 20,
        backgroundColor: '#57b947',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
    },
    emptyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});