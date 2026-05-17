import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useResponsiveLayout } from './useResponsiveLayout';

function CountLine({ text }: { text: string }) {
    return <Text style={styles.countLine}>{text}</Text>;
}

export default function TelaSuporteScreen() {
    const { compact } = useResponsiveLayout();
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.screen}>
            <View style={[styles.header, compact && styles.headerCompact]}>
                <Image source={require('../assets/images/greenleaf.png')} style={[styles.logo, compact && styles.logoCompact]} resizeMode="contain" />
            </View>

            <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, compact && styles.titleCompact]}>Suporte</Text>

                <TouchableOpacity style={[styles.imageButton, compact && styles.imageButtonCompact]} activeOpacity={0.85}>
                    <Ionicons name="image-outline" size={12} color="#666666" />
                    <Text style={[styles.imageButtonText, compact && styles.imageButtonTextCompact]}>Adicionar uma imagem</Text>
                </TouchableOpacity>

                <Text style={[styles.sectionLabel, compact && styles.sectionLabelCompact]}>Sua pergunta para o Suporte Técnico</Text>
                <View style={[styles.textAreaWrap, compact && styles.textAreaWrapCompact]}>
                    <TextInput
                        multiline
                        placeholder="Adicione uma pergunta indicando o que há de errado..."
                        placeholderTextColor="#a8a8a8"
                        style={[styles.textArea, compact && styles.textAreaCompact]}
                    />
                </View>
                <CountLine text="0/2500 caracteres" />

                <Text style={[styles.sectionLabel, compact && styles.sectionLabelCompact]}>Como se sente com o aplicativo</Text>
                <View style={[styles.textAreaWrapSmall, compact && styles.textAreaWrapSmallCompact]}>
                    <TextInput
                        multiline
                        placeholder="Adicione aqui o que você esta achando do aplicativo..."
                        placeholderTextColor="#a8a8a8"
                        style={[styles.textAreaSmall, compact && styles.textAreaSmallCompact]}
                    />
                </View>
                <CountLine text="0/200 caracteres" />

                <TouchableOpacity style={[styles.sendButton, compact && styles.sendButtonCompact]} activeOpacity={0.88}>
                    <Text style={[styles.sendButtonText, compact && styles.sendButtonTextCompact]}>Enviar</Text>
                </TouchableOpacity>
            </ScrollView>

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

                <TouchableOpacity style={styles.navItem} activeOpacity={0.75}>
                    <View style={styles.iconWrap}>
                        <MaterialCommunityIcons name="headset" size={32} color="#5bbb48" />
                    </View>
                    <View style={styles.activeDot} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} activeOpacity={0.75} onPress={() => router.replace('/telaconfig')}>
                    <View style={styles.iconWrap}>
                        <Ionicons name="settings" size={32} color="#5bbb48" />
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#dcdcdc',
    },
    header: {
        height: 90,
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
    logo: {
        width: 172,
        height: 56,
    },
    headerCompact: {
        height: 82,
    },
    logoCompact: {
        width: 160,
        height: 52,
    },
    content: {
        flexGrow: 1,
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    contentCompact: {
        paddingTop: 16,
        paddingHorizontal: 18,
        paddingBottom: 16,
    },
    title: {
        fontSize: 40,
        color: '#474747',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
    },
    titleCompact: {
        fontSize: 32,
        marginBottom: 16,
    },
    imageButton: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: '#f7f7f7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 1.6,
        elevation: 3,
        marginBottom: 18,
    },
    imageButtonCompact: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginBottom: 14,
    },
    imageButtonText: {
        fontSize: 15,
        color: '#666666',
        fontWeight: '500',
    },
    imageButtonTextCompact: {
        fontSize: 13,
    },
    sectionLabel: {
        fontSize: 16,
        color: '#5b5b5b',
        marginBottom: 14,
    },
    sectionLabelCompact: {
        fontSize: 14,
        marginBottom: 10,
    },
    textAreaWrap: {
        minHeight: 104,
        borderRadius: 16,
        backgroundColor: '#f7f7f7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 2,
        elevation: 4,
        paddingHorizontal: 14,
        paddingTop: 14,
    },
    textAreaWrapCompact: {
        minHeight: 92,
        paddingTop: 12,
    },
    textArea: {
        minHeight: 100,
        fontSize: 14,
        color: '#666666',
        textAlignVertical: 'top',
    },
    textAreaCompact: {
        minHeight: 82,
        fontSize: 13,
    },
    textAreaWrapSmall: {
        minHeight: 76,
        borderRadius: 16,
        backgroundColor: '#f7f7f7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 2,
        elevation: 4,
        paddingHorizontal: 14,
        paddingTop: 12,
    },
    textAreaWrapSmallCompact: {
        minHeight: 68,
        paddingTop: 10,
    },
    textAreaSmall: {
        minHeight: 66,
        fontSize: 14,
        color: '#666666',
        textAlignVertical: 'top',
    },
    textAreaSmallCompact: {
        minHeight: 58,
        fontSize: 13,
    },
    countLine: {
        textAlign: 'right',
        marginTop: 4,
        marginBottom: 12,
        color: '#5a5a5a',
        fontSize: 13,
    },
    sendButton: {
        marginTop: 8,
        alignSelf: 'center',
        width: '100%',
        height: 42,
        borderRadius: 22,
        backgroundColor: '#4f4f4f',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 2,
        elevation: 4,
    },
    sendButtonCompact: {
        height: 38,
        marginTop: 4,
    },
    sendButtonText: {
        color: '#f4f4f4',
        fontSize: 16,
        fontWeight: '700',
    },
    sendButtonTextCompact: {
        fontSize: 15,
    },
    bottomBar: {
        borderTopWidth: 1,
        borderTopColor: '#b8b8b8',
        backgroundColor: '#ededed',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.16,
        shadowRadius: 2,
        elevation: 9,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 54,
        position: 'relative',
    },
    iconWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: 'transparent',
        marginBottom: 8,
    },
    activeDot: {
        position: 'absolute',
        bottom: 8,
        left: '50%',
        marginLeft: -3,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#5bbb48',
    },
});
