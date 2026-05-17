import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

    return (
        <SafeAreaView style={styles.screen}>
            <View style={[styles.header, compact && styles.headerCompact]}>
                <Image source={require('../assets/images/greenleaf.png')} style={[styles.logo, compact && styles.logoCompact]} resizeMode="contain" />
            </View>

            <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, compact && styles.titleCompact]}>Configurações</Text>

                <View style={[styles.rows, compact && styles.rowsCompact]}>
                    <ConfigRow iconName="person" label="Perfil" onPress={() => router.push('/perfil')} />
                    <ConfigRow iconName="notifications" label="Notificações" />
                    <ConfigRow iconName="eye" label="Acessibilidade" />
                    <ConfigRow iconName="lock-closed" label="Privacidade" />
                    <ConfigRow iconName="headset" label="Suporte" onPress={() => router.push('/telasuporte')} />
                    <ConfigRow iconName="help-circle" label="Dúvidas" onPress={() => router.push('/duvidas')} />
                </View>
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
    screen: {
        flex: 1,
        backgroundColor: '#dcdcdc',
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
    logo: {
        width: 172,
        height: 56,
        marginTop: 12,
    },
    headerCompact: {
        height: 82,
    },
    logoCompact: {
        width: 160,
        height: 52,
        marginTop: 12,
    },
    content: {
        flexGrow: 1,
        paddingTop: 26,
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    contentCompact: {
        paddingTop: 18,
        paddingHorizontal: 18,
    },
    title: {
        fontSize: 40,
        color: '#474747',
        fontWeight: '700',
        textAlign: 'left',
        marginBottom: 24,
    },
    titleCompact: {
        fontSize: 32,
        marginBottom: 18,
    },
    rows: {
        gap: 10,
    },
    rowsCompact: {
        gap: 8,
    },
    row: {
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    rowLabel: {
        fontSize: 24,
        color: '#5a5a5a',
        fontWeight: '500',
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
