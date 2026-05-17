import { router } from 'expo-router';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MapaCalorScreen() {
    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.header}>
                <Image source={require('../assets/images/greenleaf.png')} style={styles.logo} resizeMode="contain" />
            </View>

            <View style={styles.content}>
                <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={styles.backRow}>
                    <Text style={styles.backText}>← Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Mapa de Calor</Text>

                <View style={styles.mapCard}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' }}
                        style={styles.mapImage}
                    />
                    <View style={styles.heatOverlay} />
                    <View style={styles.pin} />
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.handle} />
                    <View style={styles.infoRow}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.leafIcon}>🍃</Text>
                        </View>
                        <Text style={styles.infoTitle}>Localidade da planta</Text>
                    </View>
                    <View style={styles.locationRow}>
                        <Text style={styles.locationPin}>⌖</Text>
                        <Text style={styles.locationText}>-24.491957, -47.855457</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#f4f4f4' },
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
    logo: { width: 172, height: 56, marginTop: 12 },
    content: { flex: 1, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
    backRow: { alignSelf: 'flex-start', paddingVertical: 4 },
    backText: { fontSize: 16, color: '#4d4d4d', fontWeight: '600' },
    title: { textAlign: 'center', fontSize: 22, fontWeight: '700', color: '#4a4a4a', marginTop: 4, marginBottom: 18 },
    mapCard: {
        height: 255,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#e8e1d6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.16,
        shadowRadius: 2,
        elevation: 4,
    },
    mapImage: { width: '100%', height: '100%' },
    heatOverlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    pin: {
        position: 'absolute',
        left: 20,
        bottom: 26,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#3b2cff',
        borderWidth: 3,
        borderColor: '#c8d0ff',
    },
    infoCard: {
        marginTop: 14,
        backgroundColor: '#fff',
        borderRadius: 28,
        paddingHorizontal: 18,
        paddingTop: 10,
        paddingBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 4,
    },
    handle: {
        alignSelf: 'center',
        width: 44,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#1d1d1d',
        marginBottom: 14,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1a1f42', justifyContent: 'center', alignItems: 'center' },
    leafIcon: { fontSize: 22 },
    infoTitle: { fontSize: 18, fontWeight: '700', color: '#1f1f1f' },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20, paddingLeft: 8 },
    locationPin: { fontSize: 28, color: '#3b2cff' },
    locationText: { fontSize: 18, fontWeight: '700', color: '#151515' },
});