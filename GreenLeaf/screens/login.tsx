import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { API_BASE_URL } from '../constants/api';
import { useResponsiveLayout } from './useResponsiveLayout';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { compact } = useResponsiveLayout();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Atenção', 'Preencha email e senha.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.status === 404) {
                Alert.alert('Conta não encontrada', 'Você ainda não tem cadastro. Vamos criar agora.');
                router.push({ pathname: '/cadastro', params: { email } });
                return;
            }

            if (!response.ok) {
                Alert.alert('Erro', data?.message || 'Não foi possível entrar.');
                return;
            }

            router.replace('/principal');
        } catch (error) {
            Alert.alert('Erro', 'Falha na conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={[styles.topArea, compact && styles.topAreaCompact]}>
                <Image
                    source={require('../assets/images/greenleaf.png')}
                    style={[styles.logo, compact && styles.logoCompact]}
                    resizeMode="contain"
                />
            </View>

            <ScrollView contentContainerStyle={[styles.bottomArea, compact && styles.bottomAreaCompact]} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, compact && styles.titleCompact]}>Login</Text>

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

                <TouchableOpacity activeOpacity={0.75}>
                    <Text style={[styles.secondaryLink, compact && styles.secondaryLinkCompact]}>Esqueceu a senha?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.loginButton, compact && styles.loginButtonCompact]}
                    activeOpacity={0.85}
                    onPress={handleLogin}
                    disabled={loading}>
                    <Text style={[styles.loginButtonText, compact && styles.loginButtonTextCompact]}>{loading ? 'Entrando...' : 'Login'}</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.75} onPress={() => router.push('/cadastro')}>
                    <Text style={[styles.signUpLink, compact && styles.signUpLinkCompact]}>Nao tenho Conta!</Text>
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
    topArea: {
        height: '32%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 26,
    },
    topAreaCompact: {
        height: '26%',
        paddingTop: 18,
    },
    logo: {
        width: 190,
        height: 96,
    },
    logoCompact: {
        width: 168,
        height: 84,
    },
    bottomArea: {
        flexGrow: 1,
        backgroundColor: '#ececec',
        borderTopLeftRadius: 86,
        paddingTop: 62,
        alignItems: 'center',
        paddingBottom: 24,
    },
    bottomAreaCompact: {
        borderTopLeftRadius: 72,
        paddingTop: 42,
    },
    title: {
        fontSize: 45,
        fontWeight: '700',
        color: '#4a4a4a',
        marginBottom: 56,
    },
    titleCompact: {
        fontSize: 34,
        marginBottom: 28,
    },
    input: {
        width: '83%',
        height: 48,
        borderRadius: 16,
        backgroundColor: '#dcdcdc',
        paddingHorizontal: 16,
        fontSize: 20,
        fontWeight: '600',
        color: '#4f4f4f',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 2.2,
        elevation: 4,
    },
    inputCompact: {
        height: 42,
        fontSize: 16,
        marginBottom: 14,
    },
    secondaryLink: {
        alignSelf: 'flex-start',
        width: '83%',
        fontSize: 15,
        color: '#4a4a4a',
        fontWeight: '500',
        marginTop: -8,
        marginBottom: 42,
    },
    secondaryLinkCompact: {
        fontSize: 13,
        marginBottom: 22,
    },
    loginButton: {
        width: '60%',
        height: 48,
        borderRadius: 17,
        backgroundColor: '#4e4f52',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 2.5,
        elevation: 4,
    },
    loginButtonCompact: {
        height: 42,
    },
    loginButtonText: {
        color: '#f1f1f1',
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    loginButtonTextCompact: {
        fontSize: 22,
    },
    signUpLink: {
        fontSize: 15,
        color: '#4a4a4a',
        fontWeight: '500',
    },
    signUpLinkCompact: {
        fontSize: 13,
    },
});
