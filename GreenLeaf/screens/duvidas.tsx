import { router } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const popularIssues = [
    'Como identificar bacteriose com Green Leaf?',
    'Ferrugem nas folhas',
    'Manchas amareladas',
    'Folhas secando nas pontas',
];

const popularImages = [
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
];

export default function DuvidasScreen() {
    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.header}>
                <Image source={require('../assets/images/greenleaf.png')} style={styles.logo} resizeMode="contain" />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={styles.backRow}>
                    <Text style={styles.backText}>← Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Dúvidas Frequentes</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featureRow}>
                    {popularIssues.map((text, index) => (
                        <View key={text} style={[styles.featureCard, index === 0 && styles.featureCardLarge]}>
                            <Image source={{ uri: popularImages[index % popularImages.length] }} style={styles.featureImage} />
                            <Text style={styles.featureText}>{text}</Text>
                        </View>
                    ))}
                </ScrollView>

                <Text style={styles.sectionTitle}>Manchas Populares</Text>

                <View style={styles.grid}>
                    {popularImages.concat(popularImages).map((uri, index) => (
                        <View key={`${uri}-${index}`} style={styles.gridTile}>
                            <Image source={{ uri }} style={styles.gridImage} />
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
    backRow: { alignSelf: 'flex-start', paddingVertical: 6 },
    backText: { fontSize: 16, color: '#4d4d4d', fontWeight: '600' },
    title: { textAlign: 'center', fontSize: 24, fontWeight: '700', color: '#4a4a4a', marginBottom: 16 },
    featureRow: { gap: 12, paddingBottom: 14 },
    featureCard: {
        width: 220,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#111',
        height: 160,
    },
    featureCardLarge: { width: 255 },
    featureImage: { width: '100%', height: '100%', opacity: 0.75 },
    featureText: {
        position: 'absolute',
        left: 14,
        right: 14,
        bottom: 14,
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
    sectionTitle: { fontSize: 22, fontWeight: '700', color: '#4a4a4a', marginTop: 8, marginBottom: 14 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
    gridTile: { width: '48%', height: 88, borderRadius: 12, overflow: 'hidden', backgroundColor: '#e5e5e5' },
    gridImage: { width: '100%', height: '100%' },
});