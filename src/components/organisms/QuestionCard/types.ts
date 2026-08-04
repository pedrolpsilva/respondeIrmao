import { Question } from '@/constants/questions';
import { StyleProp, ViewStyle } from 'react-native';

export interface QuestionCardProps {
  question: Question;
  levelLabel: string;
  actionTrigger: 'slide' | 'flip' | null;
  showAnswerButton?: boolean;
  timeUp?: boolean;
  showAnswer?: boolean;
  onToggleAnswer?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  isTabletLandscape?: boolean;
}
