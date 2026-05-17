import { router } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const historyImages = [
    'https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=80',
];

export default function HistoricoScreen() {
    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.header}>
                <Image source={require('../assets/images/greenleaf.png')} style={styles.logo} resizeMode="contain" />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={styles.backRow}>
                    <Text style={styles.backText}>← Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Histórico</Text>

                <View style={styles.grid}>
                    {historyImages.map((uri, index) => (
                        <View key={`${uri}-${index}`} style={styles.tile}>
                            <Image source={{ uri }} style={styles.tileImage} />
                        </View>
                    ))}
                </View>
            </ScrollView>
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
    content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
    backRow: { alignSelf: 'flex-start', paddingVertical: 4 },
    backText: { fontSize: 16, color: '#4d4d4d', fontWeight: '600' },
    title: { textAlign: 'center', fontSize: 24, fontWeight: '700', color: '#4a4a4a', marginTop: 6, marginBottom: 16 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
    tile: { width: '31%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#e8e8e8' },
    tileImage: { width: '100%', height: '100%' },
});