import { StyleProp, TextInputProps, ViewStyle } from 'react-native';

export interface BrutalInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  hasError?: boolean;
}
