import { Colors, Fonts, Metrics } from '@/constants/theme';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, RotateCw, X, Zap, ZapOff } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BrutalButton from './BrutalButton';

const { width: screenWidth } = Dimensions.get('window');

interface BrutalCameraModalProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (uri: string) => void;
}

export default function BrutalCameraModal({ visible, onClose, onCapture }: BrutalCameraModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!visible) return null;

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
      });

      if (photo && photo.uri) {
        let imgWidth = photo.width;
        let imgHeight = photo.height;

        // Fallback: If dimensions are missing, query them using image manipulator
        if (!imgWidth || !imgHeight) {
          try {
            const info = await ImageManipulator.manipulateAsync(photo.uri, []);
            imgWidth = info.width;
            imgHeight = info.height;
          } catch (manipErr) {
            console.warn('Failed to query image dimensions:', manipErr);
          }
        }

        // If we still don't have dimensions, fall back to safe defaults
        const finalWidth = imgWidth || 1200;
        const finalHeight = imgHeight || 1200;

        // Programmatic center square crop
        const size = Math.floor(Math.min(finalWidth, finalHeight));
        const originX = Math.floor((finalWidth - size) / 2);
        const originY = Math.floor((finalHeight - size) / 2);

        const cropResult = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            {
              crop: {
                originX,
                originY,
                width: size,
                height: size,
              },
            },
            {
              resize: {
                width: 600,
                height: 600,
              },
            },
          ],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        onCapture(cropResult.uri);
      }
    } catch (err: any) {
      console.warn('Error taking picture:', err);
      alert('Erro ao processar foto: ' + (err?.message || err));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Você precisa permitir o acesso à galeria para escolher fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onCapture(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Error picking image from gallery:', err);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((prev) => (prev === 'off' ? 'on' : 'off'));
  };

  const renderContent = () => {
    if (!permission) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Precisamos de sua permissão para abrir a câmera
          </Text>
          <BrutalButton variant="primary" onPress={requestPermission} style={styles.permissionBtn}>
            Permitir Câmera
          </BrutalButton>
          <BrutalButton variant="surface" onPress={onClose} style={styles.permissionBtn}>
            Cancelar
          </BrutalButton>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        {/* Header Bar */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.iconButton} hitSlop={15}>
            <X color="#FFFFFF" size={28} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.headerTitle}>Foto do Jogador</Text>
          <Pressable onPress={toggleFlash} style={styles.iconButton} hitSlop={15}>
            {flash === 'on' ? (
              <Zap color="#F59E0B" size={28} strokeWidth={2.5} />
            ) : (
              <ZapOff color="#FFFFFF" size={28} strokeWidth={2.5} />
            )}
          </Pressable>
        </View>

        {/* Viewfinder: Square Viewport */}
        <View style={styles.viewfinderContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.cameraView}
            facing={facing}
            flash={flash}
          />
          
          {/* Custom Bounding Grid Overlay */}
          <View style={styles.gridOverlay}>
            <View style={styles.gridRow}>
              <View style={styles.gridCell} />
              <View style={[styles.gridCell, styles.borderHorizontal]} />
              <View style={styles.gridCell} />
            </View>
            <View style={[styles.gridRow, styles.borderVertical]}>
              <View style={styles.gridCell} />
              <View style={[styles.gridCell, styles.borderHorizontal]}>
                {/* Yellow center crosshair */}
                <View style={styles.crosshairH} />
                <View style={styles.crosshairV} />
              </View>
              <View style={styles.gridCell} />
            </View>
            <View style={styles.gridRow}>
              <View style={styles.gridCell} />
              <View style={[styles.gridCell, styles.borderHorizontal]} />
              <View style={styles.gridCell} />
            </View>
          </View>
        </View>

        {/* Control Footer */}
        <View style={styles.footer}>
          {/* Gallery Button */}
          <Pressable onPress={handleOpenGallery} style={styles.footerButton} hitSlop={15}>
            <ImageIcon color="#FFFFFF" size={30} strokeWidth={2} />
          </Pressable>

          {/* Capture Button (Large Double Circle) */}
          <Pressable onPress={handleCapture} disabled={isProcessing} style={styles.captureButtonContainer}>
            {isProcessing ? (
              <View style={styles.captureButtonInnerLoading}>
                <ActivityIndicator size="small" color={Colors.text} />
              </View>
            ) : (
              <View style={styles.captureButtonOuter}>
                <View style={styles.captureButtonInner} />
              </View>
            )}
          </Pressable>

          {/* Flip Camera Button */}
          <Pressable onPress={toggleFacing} style={styles.footerButton} hitSlop={15}>
            <RotateCw color="#FFFFFF" size={30} strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalSafeArea}>
        {renderContent()}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 32,
  },
  permissionText: {
    fontFamily: Fonts.subheading,
    fontSize: 20,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionBtn: {
    width: '100%',
    marginBottom: 12,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#000000',
  },
  headerTitle: {
    fontFamily: Fonts.heading,
    fontSize: 18,
    color: '#FFFFFF',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderContainer: {
    width: screenWidth,
    height: screenWidth,
    position: 'relative',
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#333333',
  },
  cameraView: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderHorizontal: {
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  borderVertical: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  crosshairH: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: '#FCD34D',
  },
  crosshairV: {
    position: 'absolute',
    width: 2,
    height: 16,
    backgroundColor: '#FCD34D',
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 24,
    backgroundColor: '#000000',
  },
  footerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1C1917',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  captureButtonInnerLoading: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
