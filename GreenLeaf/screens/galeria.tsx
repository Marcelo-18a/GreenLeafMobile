import { router } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useResponsiveLayout } from './useResponsiveLayout';

type GalleryItem = {
    uri: string;
};

const galleryItems: GalleryItem[] = [
    { uri: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80' },
    { uri: 'https://images.unsplash.com/photo-1512427691650-35ad33e6e7f8?auto=format&fit=crop&w=600&q=80' },
    { uri: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=600&q=80' },
    { uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80' },
    { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
    { uri: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80' },
    { uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80' },
    { uri: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=80' },
    { uri: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80' },
    { uri: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&w=600&q=80' },
    { uri: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80' },
    { uri: 'https://images.unsplash.com/photo-1491146179969-d674118945ff?auto=format&fit=crop&w=600&q=80' },
];

function GalleryTile({ uri }: GalleryItem) {
    return (
        <View style={styles.tile}>
            <Image source={{ uri }} style={styles.tileImage} resizeMode="cover" />
        </View>
    );
}

export default function GaleriaScreen() {
    const { compact } = useResponsiveLayout();
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.screen}>
            <View style={[styles.header, compact && styles.headerCompact]}>
                <Image source={require('../assets/images/greenleaf.png')} style={[styles.logo, compact && styles.logoCompact]} resizeMode="contain" />
            </View>

            <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, compact && styles.titleCompact]}>Galeria</Text>

                <View style={styles.grid}>
                    {galleryItems.map((item, index) => (
                        <GalleryTile key={`${item.uri}-${index}`} uri={item.uri} />
                    ))}
                </View>
            </ScrollView>

            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8, height: 82 + insets.bottom }]}>
                <TouchableOpacity style={styles.navItem} activeOpacity={0.75} onPress={() => router.replace('/principal')}>
                    <View style={styles.iconWrap}>
                        <Ionicons name="home" size={36} color="#5bbb48" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} activeOpacity={0.75}>
                    <View style={styles.iconWrap}>
                        <Ionicons name="archive" size={32} color="#5bbb48" />
                    </View>
                    <View style={styles.activeDot} />
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
        paddingTop: 22,
        paddingHorizontal: 18,
        paddingBottom: 18,
    },
    contentCompact: {
        paddingTop: 16,
        paddingHorizontal: 14,
    },
    title: {
        textAlign: 'center',
        fontSize: 38,
        color: '#474747',
        fontWeight: '700',
        marginBottom: 20,
    },
    titleCompact: {
        fontSize: 32,
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 10,
    },
    tile: {
        width: '31%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#ececec',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.16,
        shadowRadius: 2,
        elevation: 3,
    },
    tileImage: {
        width: '100%',
        height: '100%',
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
