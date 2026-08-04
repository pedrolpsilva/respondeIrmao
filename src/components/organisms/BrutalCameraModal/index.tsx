import { BrutalButton } from '@/components/atoms/BrutalButton';
import { useTheme } from '@/hooks/use-theme';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { ImageIcon, RotateCw, X, Zap, ZapOff } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, SafeAreaView, Text, View } from 'react-native';
import { createStyles } from './styles';
import { BrutalCameraModalProps } from './types';

export const BrutalCameraModal: React.FC<BrutalCameraModalProps> = ({
  visible,
  onClose,
  onCapture,
}) => {
  const theme = useTheme();
  const { isTablet } = useTabletLandscape();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<any>(null);

  const styles = createStyles(isTablet);

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

        if (!imgWidth || !imgHeight) {
          try {
            const info = await ImageManipulator.manipulateAsync(photo.uri, []);
            imgWidth = info.width;
            imgHeight = info.height;
          } catch (manipErr) {
            console.warn('Failed to query image dimensions:', manipErr);
          }
        }

        const finalWidth = imgWidth || 1200;
        const finalHeight = imgHeight || 1200;

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
        <View style={[styles.permissionContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.permissionText, { color: theme.text }]}>
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
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.iconButton} hitSlop={15}>
            <X color="#FFFFFF" size={isTablet ? 32 : 28} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.headerTitle}>Foto do Jogador</Text>
          <Pressable onPress={toggleFlash} style={styles.iconButton} hitSlop={15}>
            {flash === 'on' ? (
              <Zap color="#F59E0B" size={isTablet ? 32 : 28} strokeWidth={2.5} />
            ) : (
              <ZapOff color="#FFFFFF" size={isTablet ? 32 : 28} strokeWidth={2.5} />
            )}
          </Pressable>
        </View>

        <View style={styles.viewfinderContainer}>
          <CameraView ref={cameraRef} style={styles.cameraView} facing={facing} flash={flash} />
          <View style={styles.gridOverlay}>
            <View style={styles.gridRow}>
              <View style={styles.gridCell} />
              <View style={[styles.gridCell, styles.borderHorizontal]} />
              <View style={styles.gridCell} />
            </View>
            <View style={[styles.gridRow, styles.borderVertical]}>
              <View style={styles.gridCell} />
              <View style={[styles.gridCell, styles.borderHorizontal]}>
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

        <View style={styles.footer}>
          <Pressable onPress={handleOpenGallery} style={styles.footerButton} hitSlop={15}>
            <ImageIcon color="#FFFFFF" size={isTablet ? 36 : 30} strokeWidth={2} />
          </Pressable>

          <Pressable onPress={handleCapture} disabled={isProcessing} style={styles.captureButtonContainer}>
            {isProcessing ? (
              <View style={styles.captureButtonInnerLoading}>
                <ActivityIndicator size="small" color={theme.text} />
              </View>
            ) : (
              <View style={styles.captureButtonOuter}>
                <View style={styles.captureButtonInner} />
              </View>
            )}
          </Pressable>

          <Pressable onPress={toggleFacing} style={styles.footerButton} hitSlop={15}>
            <RotateCw color="#FFFFFF" size={isTablet ? 36 : 30} strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalSafeArea}>{renderContent()}</SafeAreaView>
    </Modal>
  );
};

export default BrutalCameraModal;
