import { router } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

import { useResponsiveLayout } from './useResponsiveLayout';

export default function CadastroScreen() {
    const { compact } = useResponsiveLayout();

    return (
        <SafeAreaView style={styles.screen}>
            <Image source={require('../assets/images/greenleaf.png')} style={[styles.logo, compact && styles.logoCompact]} resizeMode="contain" />

            <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, compact && styles.titleCompact]}>Cadastrar-se</Text>

                <TextInput placeholder="Nome" placeholderTextColor="#4f4f4f" style={[styles.input, compact && styles.inputCompact]} />
                <TextInput placeholder="Email" placeholderTextColor="#4f4f4f" style={[styles.input, compact && styles.inputCompact]} autoCapitalize="none" keyboardType="email-address" />
                <TextInput placeholder="Senha" placeholderTextColor="#4f4f4f" style={[styles.input, compact && styles.inputCompact]} secureTextEntry />
                <TextInput placeholder="Confirmar senha" placeholderTextColor="#4f4f4f" style={[styles.input, compact && styles.inputCompact]} secureTextEntry />

                <TouchableOpacity style={[styles.button, compact && styles.buttonCompact]} activeOpacity={0.85}>
                    <Text style={[styles.buttonText, compact && styles.buttonTextCompact]}>Cadastrar-se</Text>
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
        alignItems: 'center',
    },
    logo: {
        marginTop: 14,
        width: 190,
        height: 92,
    },
    logoCompact: {
        width: 168,
        height: 84,
    },
    content: {
        width: '100%',
        flexGrow: 1,
        backgroundColor: '#ececec',
        borderTopLeftRadius: 86,
        borderTopRightRadius: 0,
        paddingTop: 34,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    contentCompact: {
        borderTopLeftRadius: 72,
        paddingTop: 28,
    },
    title: {
        fontSize: 33,
        fontWeight: '700',
        color: '#4a4a4a',
        marginBottom: 22,
    },
    titleCompact: {
        fontSize: 28,
        marginBottom: 16,
    },
    input: {
        width: '86%',
        height: 46,
        borderRadius: 16,
        backgroundColor: '#dcdcdc',
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '600',
        color: '#4f4f4f',
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 2,
        elevation: 4,
    },
    inputCompact: {
        height: 40,
        fontSize: 14,
        marginBottom: 10,
    },
    button: {
        marginTop: 8,
        width: '52%',
        height: 44,
        borderRadius: 16,
        backgroundColor: '#4e4f52',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.28,
        shadowRadius: 2.2,
        elevation: 4,
    },
    buttonCompact: {
        height: 40,
    },
    buttonText: {
        color: '#f1f1f1',
        fontSize: 20,
        fontWeight: '700',
    },
    buttonTextCompact: {
        fontSize: 18,
    },
    link: {
        marginTop: 12,
        fontSize: 13,
        color: '#4a4a4a',
        fontWeight: '500',
    },
    linkCompact: {
        fontSize: 12,
    },
});