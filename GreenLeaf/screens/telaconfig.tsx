import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useResponsiveLayout } from './useResponsiveLayout';

function ConfigRow({ iconName }: { iconName: React.ComponentProps<typeof Ionicons>['name'] }) {
    return (
        <TouchableOpacity style={styles.row} activeOpacity={0.85}>
            <View style={styles.rowLeft}>
                <Ionicons name={iconName} size={28} color="#4f4f4f" />
                <Text style={styles.rowLabel}>Conta</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#4f4f4f" />
        </TouchableOpacity>
    );
}

export default function TelaConfigScreen() {
    const { compact } = useResponsiveLayout();

    return (
        <SafeAreaView style={styles.screen}>
            <View style={[styles.header, compact && styles.headerCompact]}>
                <Image source={require('../assets/images/greenleaf.png')} style={[styles.logo, compact && styles.logoCompact]} resizeMode="contain" />
            </View>

            <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, compact && styles.titleCompact]}>Configuracoes</Text>

                <View style={[styles.rows, compact && styles.rowsCompact]}>
                    <ConfigRow iconName="person" />
                    <ConfigRow iconName="notifications" />
                    <ConfigRow iconName="eye" />
                    <ConfigRow iconName="lock-closed" />
                    <ConfigRow iconName="headset" />
                    <ConfigRow iconName="help-circle" />
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.navItem} activeOpacity={0.75} onPress={() => router.replace('/principal')}>
                    <Ionicons name="home" size={32} color="#5bbb48" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} activeOpacity={0.75} onPress={() => router.push('/galeria')}>
                    <Ionicons name="archive" size={28} color="#5bbb48" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} activeOpacity={0.75} onPress={() => router.push('/telasuporte')}>
                    <MaterialCommunityIcons name="headset" size={28} color="#5bbb48" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} activeOpacity={0.75}>
                    <Ionicons name="settings" size={28} color="#5bbb48" />
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
        height: 90,
        backgroundColor: '#57b947',
        borderBottomRightRadius: 30,
        borderBottomColor: '#0a86ff',
        borderBottomWidth: 2,
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
        height: 82,
        borderTopWidth: 1,
        borderTopColor: '#b8b8b8',
        backgroundColor: '#ededed',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
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
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#5bbb48',
        marginTop: -5,
    },
});
