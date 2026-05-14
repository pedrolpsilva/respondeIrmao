import React from 'react';
import { Modal, StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import { Colors, Fonts, Metrics, Spacing } from '@/constants/theme';
import BrutalButton from './BrutalButton';

interface BrutalModalProps {
  visible: boolean;
  title: string;
  message?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'primary' | 'danger';
  showCancel?: boolean;
}

export default function BrutalModal({
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
}: BrutalModalProps) {
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <Animated.View 
          style={[
            styles.container,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Shadow Background */}
          <View style={styles.shadow} />
          
          {/* Main Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
            
            {children}
            
            <View style={styles.footer}>
              {showCancel && (
                <>
                  <BrutalButton
                    variant="surface"
                    onPress={onCancel}
                    style={styles.button}
                    size="medium"
                  >
                    {cancelText}
                  </BrutalButton>
                  <View style={{ width: Spacing.two }} />
                </>
              )}
              
              <BrutalButton
                variant={variant === 'danger' ? 'accent2' : 'primary'}
                onPress={onConfirm}
                style={styles.button}
                size="medium"
              >
                {confirmText}
              </BrutalButton>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  shadow: {
    position: 'absolute',
    top: Metrics.shadowOffset,
    left: Metrics.shadowOffset,
    right: -Metrics.shadowOffset,
    bottom: -Metrics.shadowOffset,
    backgroundColor: Colors.border,
    borderRadius: Metrics.radiusCard,
  },
  content: {
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    padding: Spacing.four,
    zIndex: 1,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 24,
    color: Colors.text,
    marginBottom: Spacing.two,
  },
  message: {
    fontFamily: Fonts.body,
    fontSize: 18,
    color: Colors.text,
    marginBottom: Spacing.four,
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },
  button: {
    flex: 1,
  },
});
