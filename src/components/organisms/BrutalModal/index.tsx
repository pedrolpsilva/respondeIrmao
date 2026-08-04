import { BrutalButton } from '@/components/atoms/BrutalButton';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Text, View } from 'react-native';
import { createStyles } from './styles';
import { BrutalModalProps } from './types';

export const BrutalModal: React.FC<BrutalModalProps> = ({
  visible,
  title,
  message,
  children,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'primary',
  showCancel = true,
}) => {
  const theme = useTheme();
  const { isTablet } = useTabletLandscape();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const styles = createStyles(isTablet);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={[styles.shadow, { backgroundColor: theme.border }]} />
          <View style={[styles.content, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            {message && <Text style={[styles.message, { color: theme.text }]}>{message}</Text>}

            {children}

            <View style={styles.footer}>
              {onCancel && showCancel && (
                <BrutalButton variant="surface" onPress={onCancel} style={styles.button} size="medium">
                  {cancelText}
                </BrutalButton>
              )}

              {onCancel && showCancel && onConfirm && <View style={{ width: Spacing.two }} />}

              {onConfirm && (
                <BrutalButton
                  variant={variant === 'danger' ? 'accent2' : 'primary'}
                  onPress={onConfirm}
                  style={styles.button}
                  size="medium"
                >
                  {confirmText}
                </BrutalButton>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BrutalModal;
