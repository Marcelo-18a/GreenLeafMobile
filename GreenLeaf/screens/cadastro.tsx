import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { API_BASE_URL } from '../constants/api';
import { useResponsiveLayout } from './useResponsiveLayout';

export default function CadastroScreen() {
    const params = useLocalSearchParams<{ email?: string }>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState(typeof params.email === 'string' ? params.email : '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { compact } = useResponsiveLayout();

    const handleCadastro = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Atenção', 'As senhas precisam ser iguais.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert('Erro', data?.message || 'Não foi possível cadastrar.');
                return;
            }

            Alert.alert('Sucesso', 'Conta criada com sucesso. Faça login agora.');
            router.replace('/');
        } catch (error) {
            Alert.alert('Erro', 'Falha na conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={[styles.header, compact && styles.headerCompact]}>
                <Image source={require('../assets/images/greenleaf.png')} style={[styles.logo, compact && styles.logoCompact]} resizeMode="contain" />
            </View>

            <ScrollView contentContainerStyle={[styles.card, compact && styles.cardCompact]} showsVerticalScrollIndicator={false} bounces={false}>
                <Text style={[styles.title, compact && styles.titleCompact]}>Cadastrar-se</Text>

                <TextInput
                    placeholder="Nome"
                    placeholderTextColor="#4f4f4f"
                    style={[styles.input, compact && styles.inputCompact]}
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#4f4f4f"
                    style={[styles.input, compact && styles.inputCompact]}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    placeholder="Senha"
                    placeholderTextColor="#4f4f4f"
                    style={[styles.input, compact && styles.inputCompact]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    placeholder="Confirmar senha"
                    placeholderTextColor="#4f4f4f"
                    style={[styles.input, compact && styles.inputCompact]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={[styles.button, compact && styles.buttonCompact]} activeOpacity={0.85} onPress={handleCadastro} disabled={loading}>
                    <Text style={[styles.buttonText, compact && styles.buttonTextCompact]}>{loading ? 'Cadastrando...' : 'Cadastrar-se'}</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.75} onPress={() => router.replace('/')}>
                    <Text style={[styles.link, compact && styles.linkCompact]}>Já tenho conta!</Text>
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
        height: '28%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 18,
    },
    headerCompact: {
        height: '26%',
        paddingTop: 14,
    },
    logo: {
        width: 198,
        height: 96,
    },
    logoCompact: {
        width: 172,
        height: 84,
    },
    card: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 92,
        paddingTop: 42,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 28,
    },
    cardCompact: {
        borderTopRightRadius: 78,
        paddingTop: 34,
    },
    title: {
        fontSize: 34,
        fontWeight: '700',
        color: '#4a4a4a',
        marginBottom: 26,
    },
    titleCompact: {
        fontSize: 30,
        marginBottom: 18,
    },
    input: {
        width: '100%',
        height: 54,
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 18,
        fontSize: 18,
        fontWeight: '600',
        color: '#4f4f4f',
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.16,
        shadowRadius: 2.5,
        elevation: 4,
    },
    inputCompact: {
        height: 48,
        fontSize: 16,
        marginBottom: 14,
    },
    button: {
        marginTop: 10,
        minWidth: 170,
        height: 54,
        paddingHorizontal: 28,
        borderRadius: 18,
        backgroundColor: '#555456',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 2.4,
        elevation: 4,
    },
    buttonCompact: {
        minWidth: 158,
        height: 48,
    },
    buttonText: {
        color: '#f1f1f1',
        fontSize: 19,
        fontWeight: '700',
    },
    buttonTextCompact: {
        fontSize: 17,
    },
    link: {
        marginTop: 10,
        fontSize: 14,
        color: '#4a4a4a',
        fontWeight: '500',
    },
    linkCompact: {
        fontSize: 13,
    },
});