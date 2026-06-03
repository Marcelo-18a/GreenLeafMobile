import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Dimensions, StatusBar, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// URL oficial do seu backend no Render
const API_URL = 'https://greenleafmobile.onrender.com/api/diagnosticos'; 

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const cameraRef = useRef<any>(null);
    const scanAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isScanning) {
            scanAnim.setValue(0);
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scanAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
                    Animated.timing(scanAnim, { toValue: 0, duration: 2000, useNativeDriver: false })
                ])
            ).start();
        } else {
            scanAnim.stopAnimation();
        }
    }, [isScanning]);

    if (!permission) return <View style={styles.center} />;

    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Ionicons name="camera-outline" size={64} color="#5bbb48" style={{ marginBottom: 16 }} />
                <Text style={styles.permissionText}>Precisamos da sua permissão para acessar a câmera.</Text>
                <TouchableOpacity style={styles.btnPermitir} onPress={requestPermission}>
                    <Text style={styles.btnText}>Conceder Permissão</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current && !isScanning) {
            try {
                const options = { quality: 0.7, skipProcessing: false };
                const data = await cameraRef.current.takePictureAsync(options);
                const capturedUri = data.uri;

                setPhoto(capturedUri);
                setIsScanning(true);

                // Define aleatoriamente o resultado (Xanthomonas phaseoli pv. manihotis)
                const deBacteriose = Math.random() > 0.5;
                const resultadoSimulado = {
                    photoUri: capturedUri,
                    statusText: deBacteriose ? 'Bacteriose Detectada' : 'Nenhuma Bacteriose Encontrada',
                    probabilidade: deBacteriose ? Math.floor(Math.random() * (98 - 72 + 1)) + 72 : Math.floor(Math.random() * (99 - 88 + 1)) + 88,
                    cor: deBacteriose ? '#d9534f' : '#5bbb48',
                    descricao: deBacteriose 
                        ? 'Detectamos lesões angulares e necrose foliar compatíveis com Xanthomonas phaseoli.'
                        : 'A análise da estrutura foliar não indicou anomalias fitossanitárias.'
                };

                // ENVIA OS DADOS PARA O RENDER
                try {
                    await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(resultadoSimulado)
                    });
                } catch (err) {
                    console.log("Erro ao salvar no banco online:", err);
                }

                // Aguarda 5 segundos de animação
                setTimeout(() => {
                    setIsScanning(false);
                    setPhoto(null);
                    
                    router.replace({
                        pathname: "/resultado",
                        params: { 
                            photoUri: capturedUri,
                            mockedStatus: resultadoSimulado.statusText,
                            mockedProb: String(resultadoSimulado.probabilidade),
                            mockedCor: resultadoSimulado.cor,
                            mockedDesc: resultadoSimulado.descricao
                        }
                    });
                }, 5000);

            } catch (error) {
                console.log("Erro ao tirar foto:", error);
                setIsScanning(false);
            }
        }
    };

    const lineTopPosition = scanAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [height * 0.15, height * 0.85]
    });

    if (isScanning && photo) {
        return (
            <View style={styles.scanContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#000" translucent={false} />
                <Image source={{ uri: photo }} style={styles.preview} />
                <View style={styles.overlayScan}>
                    <View style={styles.scanHeaderSquare}>
                        <Text style={styles.scanHeaderTitle}>Análise Digital</Text>
                    </View>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color="#5bbb48" />
                        <Text style={styles.scanText}>Analisando com Inteligência Artificial...</Text>
                    </View>
                    <Animated.View style={[styles.scanLine, { top: lineTopPosition }]} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <View style={styles.topHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Escaneamento</Text>
                <View style={styles.placeholderView} />
            </View>
            <View style={styles.cameraContainer}>
                <CameraView style={styles.camera} ref={cameraRef}>
                    <View style={styles.overlayTargetContainer}>
                        <View style={styles.targetBox}>
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                        </View>
                    </View>
                </CameraView>
            </View>
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                    <View style={styles.internalCircle} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#dcdcdc' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#dcdcdc' },
    permissionText: { textAlign: 'center', fontSize: 16, color: '#444', marginBottom: 24, fontWeight: '500' },
    btnPermitir: { backgroundColor: '#5bbb48', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    topHeader: { height: 110, backgroundColor: '#57b947', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 45, elevation: 4, zIndex: 10 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center' },
    placeholderView: { width: 40 },
    cameraContainer: { flex: 1, overflow: 'hidden' },
    camera: { flex: 1 },
    overlayTargetContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'center', alignItems: 'center' },
    targetBox: { width: width * 0.72, height: width * 0.72, position: 'relative' },
    corner: { position: 'absolute', width: 35, height: 35, borderColor: '#fff' },
    topLeft: { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5 },
    topRight: { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5 },
    bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5 },
    bottomRight: { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5 },
    bottomBar: { height: 140, backgroundColor: '#ededed', borderTopWidth: 1, borderTopColor: '#b8b8b8', justifyContent: 'center', alignItems: 'center', elevation: 9 },
    captureButton: { width: 84, height: 84, borderRadius: 42, borderWidth: 3, borderColor: '#5bbb48', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    internalCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#fff' },
    scanContainer: { flex: 1, backgroundColor: '#000' },
    preview: { width: width, height: height, position: 'absolute', resizeMode: 'cover' },
    overlayScan: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center' },
    scanHeaderSquare: { position: 'absolute', top: 0, width: '100%', height: 110, backgroundColor: '#57b947', justifyContent: 'center', alignItems: 'center', paddingTop: 45 },
    scanHeaderTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
    loadingBox: { padding: 24, borderRadius: 16, backgroundColor: 'rgba(0, 0, 0, 0.75)', alignItems: 'center', justifyContent: 'center' },
    scanText: { color: '#fff', fontSize: 16, marginTop: 16, fontWeight: '600', textAlign: 'center' },
    scanLine: { width: '100%', height: 5, backgroundColor: '#5bbb48', position: 'absolute', zIndex: 10 }
});