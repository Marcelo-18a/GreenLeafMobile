import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useResponsiveLayout } from './useResponsiveLayout';

function ActionCard({ icon, text, onPress }: { icon: ReactNode; text: string; onPress?: () => void }) {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
            <View style={styles.cardLeft}>
                {icon}
                <Text style={styles.cardText}>{text}</Text>
            </View>
            <View style={styles.cardArrowBox}>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </View>
        </TouchableOpacity>
    );
}

export default function PrincipalScreen() {
    const { compact } = useResponsiveLayout();
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.screen}>
            <View style={[styles.header, compact && styles.headerCompact]}>
                <Image
                    source={require('../assets/images/greenleaf.png')}
                    style={[styles.logo, compact && styles.logoCompact]}
                    resizeMode="contain"
                />
            </View>

            <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} showsVerticalScrollIndicator={false}>
                <View style={styles.userRow}>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.avatarCircle, compact && styles.avatarCircleCompact]}>
                        <FontAwesome5 name="user" size={compact ? 18 : 26} color="#ffffff" solid />
                    </TouchableOpacity>

                    <Text style={[styles.userName, compact && styles.userNameCompact]}>Usuario</Text>

                    <View style={[styles.headerActions, compact && styles.headerActionsCompact]}>
                        <TouchableOpacity activeOpacity={0.8} style={[styles.smallIconCircle, compact && styles.smallIconCircleCompact]}>
                            <Ionicons name="notifications" size={compact ? 14 : 20} color="#ffffff" />
                            <View style={styles.notifyDot} />
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.8} style={[styles.smallIconCircle, compact && styles.smallIconCircleCompact]}>
                            <Ionicons name="search" size={compact ? 14 : 20} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/duvidas')}>
                    <Text style={[styles.faqLink, compact && styles.faqLinkCompact]}>Duvidas frequentes</Text>
                </TouchableOpacity>

                <View style={[styles.cardsArea, compact && styles.cardsAreaCompact]}>
                    <ActionCard
                        icon={<Ionicons name="camera" size={compact ? 18 : 24} color="#4f4f4f" />}
                        text="Tire uma foto para inteligencia artificial"
                    />

                    <ActionCard
                        icon={<Ionicons name="time-outline" size={compact ? 19 : 25} color="#4f4f4f" />}
                        text="Acessar Historico das fotos retiradas anteriormente"
                        onPress={() => router.push('/historico')}
                    />

                    <ActionCard
                        icon={<Ionicons name="location-outline" size={compact ? 19 : 25} color="#4f4f4f" />}
                        text="Visualizar mapa de calor"
                        onPress={() => router.push('/mapacalor')}
                    />
                </View>
            </ScrollView>

            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8, height: 82 + insets.bottom }]}>
                <TouchableOpacity style={styles.navItem} activeOpacity={0.75}>
                    <View style={styles.iconWrap}>
                        <Ionicons name="home" size={36} color="#5bbb48" />
                    </View>
                    <View style={styles.activeDot} />
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

                <TouchableOpacity style={styles.navItem} activeOpacity={0.75} onPress={() => router.push('/telaconfig')}>
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
        height: 108,
        backgroundColor: '#57b947',
        borderBottomRightRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 2,
        elevation: 5,
    },
    logo: {
        width: 188,
        height: 66,
    },
    headerCompact: {
        height: 92,
    },
    logoCompact: {
        width: 170,
        height: 58,
    },
    content: {
        flexGrow: 1,
        paddingTop: 10,
        paddingBottom: 14,
    },
    contentCompact: {
        paddingTop: 8,
        paddingBottom: 10,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    avatarCircle: {
        width: 74,
        height: 74,
        borderRadius: 37,
        backgroundColor: '#545454',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.28,
        shadowRadius: 2,
        elevation: 5,
    },
    avatarCircleCompact: {
        width: 62,
        height: 62,
        borderRadius: 31,
    },
    userName: {
        marginLeft: 10,
        fontSize: 32,
        fontWeight: '700',
        color: '#4a4a4a',
    },
    userNameCompact: {
        fontSize: 26,
        marginLeft: 8,
    },
    headerActions: {
        marginLeft: 'auto',
        flexDirection: 'row',
        gap: 12,
    },
    headerActionsCompact: {
        gap: 8,
    },
    smallIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#545454',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 1.7,
        elevation: 4,
    },
    smallIconCircleCompact: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    notifyDot: {
        position: 'absolute',
        top: 5,
        right: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#59be4b',
    },
    faqLink: {
        marginTop: 24,
        marginLeft: 14,
        color: '#4b4b4b',
        fontSize: 13,
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
    faqLinkCompact: {
        marginTop: 18,
        fontSize: 12,
    },
    cardsArea: {
        marginTop: 36,
        paddingHorizontal: 22,
        gap: 22,
    },
    cardsAreaCompact: {
        marginTop: 24,
        gap: 16,
    },
    card: {
        backgroundColor: '#efefef',
        borderRadius: 20,
        minHeight: 68,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 2,
        elevation: 4,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 14,
        paddingRight: 12,
    },
    cardText: {
        flex: 1,
        fontSize: 16,
        color: '#444444',
        fontWeight: '600',
        lineHeight: 20,
    },
    cardArrowBox: {
        width: 28,
        height: 28,
        borderRadius: 5,
        backgroundColor: '#515151',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 1,
        elevation: 2,
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
