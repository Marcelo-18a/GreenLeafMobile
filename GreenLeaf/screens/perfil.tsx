import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useResponsiveLayout } from './useResponsiveLayout';
import { API_BASE_URL } from '../constants/api';

const PROFILE_STORAGE_KEY = 'greenleaf_profile';

type StoredProfile = {
    name: string;
    photoUri: string;
};

export default function PerfilScreen() {
    const { compact } = useResponsiveLayout();
    const [name, setName] = useState('');
    const [photoUri, setPhotoUri] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('greenleaf_token');
                if (token) {
                    const resp = await fetch(`${API_BASE_URL}/api/users/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (resp.ok) {
                        const server = await resp.json();
                        setName(server.name || '');
                        setPhotoUri(server.photoUri || '');
                        return;
                    }
                }

                const saved = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
                if (!saved) return;
                const profile = JSON.parse(saved) as StoredProfile;
                setName(profile.name || '');
                setPhotoUri(profile.photoUri || '');
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível carregar o perfil.');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const pickProfilePhoto = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permissão necessária', 'Permita acesso à galeria para escolher sua foto.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled) {
            return;
        }

        setPhotoUri(result.assets[0].uri);
    };

    const saveProfile = async () => {
        if (!name.trim()) {
            Alert.alert('Atenção', 'Digite seu nome para salvar o perfil.');
            return;
        }

        setSaving(true);

        try {
            const profileData: StoredProfile = {
                name: name.trim(),
                photoUri,
            };

            const token = await AsyncStorage.getItem('greenleaf_token');
            if (token) {
                const resp = await fetch(`${API_BASE_URL}/api/users/me`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(profileData),
                });

                if (!resp.ok) {
                    const err = await resp.json().catch(() => ({}));
                    Alert.alert('Erro', err.message || 'Não foi possível salvar o perfil no servidor.');
                    return;
                }
            }

            await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
            Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
            router.back();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar o perfil.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={[styles.header, compact && styles.headerCompact]}>
                <Image source={require('../assets/images/greenleaf.png')} style={[styles.logo, compact && styles.logoCompact]} resizeMode="contain" />
            </View>

            <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, compact && styles.titleCompact]}>Meu perfil</Text>

                <TouchableOpacity style={[styles.avatarWrap, compact && styles.avatarWrapCompact]} onPress={pickProfilePhoto} activeOpacity={0.85}>
                    {photoUri ? (
                        <Image source={{ uri: photoUri }} style={styles.avatar} />
                    ) : (
                        <Ionicons name="person" size={compact ? 52 : 62} color="#5e5e5e" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.photoButton} onPress={pickProfilePhoto} activeOpacity={0.85}>
                    <Text style={styles.photoButtonText}>Adicionar/alterar foto</Text>
                </TouchableOpacity>

                <Text style={[styles.label, compact && styles.labelCompact]}>Nome</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Digite seu nome"
                    placeholderTextColor="#7b7b7b"
                    style={[styles.input, compact && styles.inputCompact]}
                    editable={!loading}
                />

                <TouchableOpacity style={[styles.saveButton, compact && styles.saveButtonCompact]} onPress={saveProfile} activeOpacity={0.88} disabled={saving || loading}>
                    <Text style={[styles.saveButtonText, compact && styles.saveButtonTextCompact]}>{saving ? 'Salvando...' : 'Salvar perfil'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backAction} onPress={() => router.back()} activeOpacity={0.75}>
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#58b947',
    },
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
    headerCompact: {
        height: 82,
    },
    logo: {
        width: 172,
        height: 56,
        marginTop: 12,
    },
    logoCompact: {
        width: 160,
        height: 52,
        marginTop: 12,
    },
    content: {
        flexGrow: 1,
        backgroundColor: '#ececec',
        borderTopRightRadius: 72,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 26,
        alignItems: 'center',
    },
    contentCompact: {
        paddingHorizontal: 18,
        paddingTop: 16,
    },
    title: {
        fontSize: 34,
        color: '#4b4b4b',
        fontWeight: '700',
        marginBottom: 18,
    },
    titleCompact: {
        fontSize: 30,
    },
    avatarWrap: {
        width: 132,
        height: 132,
        borderRadius: 66,
        backgroundColor: '#d9d9d9',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#5ab947',
        marginBottom: 14,
    },
    avatarWrapCompact: {
        width: 118,
        height: 118,
        borderRadius: 59,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    photoButton: {
        backgroundColor: '#4f5054',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 22,
    },
    photoButtonText: {
        color: '#efefef',
        fontSize: 15,
        fontWeight: '600',
    },
    label: {
        width: '100%',
        fontSize: 15,
        color: '#585858',
        fontWeight: '600',
        marginBottom: 8,
    },
    labelCompact: {
        fontSize: 14,
    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 16,
        backgroundColor: '#dddddd',
        paddingHorizontal: 16,
        fontSize: 18,
        color: '#4f4f4f',
        marginBottom: 22,
    },
    inputCompact: {
        height: 46,
        fontSize: 16,
    },
    saveButton: {
        width: '66%',
        height: 48,
        borderRadius: 17,
        backgroundColor: '#4f5054',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    saveButtonCompact: {
        width: '72%',
        height: 44,
    },
    saveButtonText: {
        color: '#f1f1f1',
        fontSize: 20,
        fontWeight: '700',
    },
    saveButtonTextCompact: {
        fontSize: 18,
    },
    backAction: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    backText: {
        color: '#4f4f4f',
        fontSize: 15,
        fontWeight: '600',
    },
});