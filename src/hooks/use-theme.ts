import { Colors } from '@/constants/theme';
import { useSettingsContext } from '@/hooks/useSettingsContext';

export function useTheme() {
  try {
    const { theme } = useSettingsContext();
    return theme;
  } catch (e) {
    return Colors;
  }
}
