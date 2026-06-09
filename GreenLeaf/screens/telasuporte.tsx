import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView, StatusBar, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🛠️ CORREÇÃO DA URL: Adicionado o prefixo /users para alinhar com o userRoutes.js do backend
const API_SUPORTE_URL = 'https://greenleafmobile.onrender.com/api/users/suporte'; 

export default function SuporteScreen() {
    const [pergunta, setPergunta] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    // FUNÇÃO PARA SELECIONAR IMAGEM DA GALERIA
    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
            Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria para adicionar uma imagem.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.6,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    // FUNÇÃO DE ENVIO ATUALIZADA (APENAS COM A PERGUNTA E IMAGEM)
    const handleEnviarSuporte = async () => {
        if (!pergunta.trim()) {
            Alert.alert("Campo Obrigatório", "Por favor, descreva a sua dúvida ou problema para o suporte.");
            return;
        }

        try {
            setEnviando(true);
            const token = await AsyncStorage.getItem('greenleaf_token');

            const formData = new FormData();
            formData.append('pergunta', pergunta);

            if (imageUri) {
                const filename = imageUri.split('/').pop() || 'suporte_image.jpg';
                const match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image/jpeg`;
                
                if (type === 'image/jpg') type = 'image/jpeg';

                const fotoParaEnviar = {
                    uri: imageUri,
                    name: filename,
                    type: type,
                };

                formData.append('imagem', fotoParaEnviar as any);
            }

            const response = await fetch(API_SUPORTE_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData
            });

            const respostaJson = await response.json().catch(() => null);

            if (response.ok) {
                Alert.alert("Suporte Enviado!", "Sua mensagem e imagem foram entregues com sucesso!");
                setPergunta('');
                setImageUri(null);
            } else {
                Alert.alert("Erro no servidor", (respostaJson && respostaJson.message) || "O servidor recusou a requisição.");
            }

        } catch (error) {
            console.log("Erro de rede:", error);
            Alert.alert("Erro de Rede", "Não foi possível conectar ao servidor de suporte.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#57b947" />

            {/* HEADER VERDE ARREDONDADO COM A LOGO DO SEU PRINT */}
            <View style={styles.header}>
                <Image 
                    source={require('../assets/images/greenleaf.png')} 
                    style={styles.logoLogo} 
                    defaultSource={require('../assets/images/greenleaf.png')} 
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.mainTitle}>Suporte</Text>

                {/* BOTÃO ADICIONAR IMAGEM CENTRALIZADO */}
                <TouchableOpacity style={styles.imagePickerButton} onPress={handlePickImage} activeOpacity={0.8}>
                    {imageUri ? (
                        <View style={styles.previewContainer}>
                            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                            <View style={styles.changeImageOverlay}>
                                <Ionicons name="camera" size={16} color="#fff" />
                                <Text style={styles.changeImageText}>Alterar Imagem</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.pickerInner}>
                            <Ionicons name="image-outline" size={18} color="#555" style={{ marginRight: 6 }} />
                            <Text style={styles.pickerText}>Adicionar uma imagem</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* ÚNICO INPUT DA TELA: SUA PERGUNTA */}
                <Text style={styles.inputLabel}>Sua pergunta para o Suporte Técnico</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        placeholder="Adicione uma pergunta indicando o que há de errado..."
                        placeholderTextColor="#999"
                        maxLength={2500}
                        value={pergunta}
                        onChangeText={setPergunta}
                    />
                </View>
                <Text style={styles.charCounter}>{pergunta.length}/2500 caracteres</Text>

                {/* BOTÃO ENVIAR CINZA ESCURO DO PRINT */}
                <TouchableOpacity 
                    style={[styles.btnEnviar, { opacity: enviando ? 0.7 : 1 }]} 
                    onPress={handleEnviarSuporte}
                    disabled={enviando}
                    activeOpacity={0.8}
                >
                    {enviando ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.btnEnviarText}>Enviar</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
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
    logoLogo: { width: 180, height: 50, resizeMode: 'contain', marginTop: 15 },
    scrollContent: { paddingHorizontal: 28, paddingTop: 24, paddingBottom: 40, alignItems: 'center' },
    mainTitle: { fontSize: 26, fontWeight: '700', color: '#444', marginBottom: 20 },
    imagePickerButton: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '75%',
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        overflow: 'hidden'
    },
    pickerInner: { flexDirection: 'row', alignItems: 'center' },
    pickerText: { fontSize: 14, color: '#444', fontWeight: '500' },
    previewContainer: { width: '100%', height: '100%', position: 'relative' },
    imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
    changeImageOverlay: { position: 'absolute', bottom: 0, width: '100%', height: 20, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    changeImageText: { color: '#fff', fontSize: 10, marginLeft: 4, fontWeight: '600' },
    inputLabel: { alignSelf: 'flex-start', fontSize: 15, color: '#4d4d4d', fontWeight: '500', marginBottom: 12, marginTop: 4 },
    inputWrapper: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    textArea: { height: 180, fontSize: 14, color: '#333', textAlignVertical: 'top' },
    charCounter: { alignSelf: 'flex-end', fontSize: 13, color: '#555', fontWeight: '500', marginTop: 8, paddingRight: 4 },
    btnEnviar: {
        width: '100%',
        backgroundColor: '#444444',
        borderRadius: 25,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    btnEnviarText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});