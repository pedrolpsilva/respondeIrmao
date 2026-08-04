import { BrutalButton } from '@/components/atoms/BrutalButton';
import { useTheme } from '@/hooks/use-theme';
import { useTabletLandscape } from '@/hooks/useTabletLandscape';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';
import { createStyles } from './styles';
import { QuestionCardProps } from './types';

const LEVEL_DISPLAY_NAMES: Record<string, string> = {
  multidao: 'Multidão',
  discipulo: 'Discípulo',
  apostolo: 'Apóstolo',
  comunhao: 'Comunhão',
  testemunho: 'Testemunho',
  confissao: 'Confissão',
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  levelLabel,
  actionTrigger,
  showAnswerButton = false,
  timeUp,
  showAnswer = false,
  onToggleAnswer,
  containerStyle,
  isTabletLandscape: propIsTabletLandscape,
}) => {
  const theme = useTheme();
  const { isTablet, isTabletLandscape: hookIsTabletLandscape } = useTabletLandscape();
  const isTabletLandscape = propIsTabletLandscape ?? hookIsTabletLandscape;

  const slideAnim = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  const styles = React.useMemo(() => createStyles(isTablet, isTabletLandscape), [isTablet, isTabletLandscape]);

  const questionText = timeUp ? 'Tempo Esgotado!' : showAnswer ? question.correctAnswer : question.text;

  const getInitialLevelLabel = () => {
    const rawLevel = question.level || levelLabel || 'multidao';
    const levelName = LEVEL_DISPLAY_NAMES[rawLevel.toLowerCase()] || rawLevel;
    return showAnswer ? `${levelName} - Resposta` : levelName;
  };

  const [displayedText, setDisplayedText] = useState(questionText || '');
  const [displayedLevel, setDisplayedLevel] = useState(getInitialLevelLabel());
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const rawLevel = question.level || levelLabel || 'multidao';
    const levelName = LEVEL_DISPLAY_NAMES[rawLevel.toLowerCase()] || rawLevel;
    const currentLevelLabel = showAnswer ? `${levelName} - Resposta` : levelName;

    if (questionText === displayedText && currentLevelLabel === displayedLevel) return;

    if (actionTrigger === 'slide') {
      Animated.timing(slideAnim, {
        toValue: -Dimensions.get('window').width,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        if (!isMounted.current) return;
        setDisplayedText(questionText || '');
        setDisplayedLevel(currentLevelLabel);
        slideAnim.setValue(Dimensions.get('window').width);
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }).start();
      });
    } else if (actionTrigger === 'flip') {
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        if (!isMounted.current) return;
        setDisplayedText(questionText || '');
        setDisplayedLevel(currentLevelLabel);
        Animated.timing(flipAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    } else {
      setDisplayedText(questionText || '');
      setDisplayedLevel(currentLevelLabel);
    }
  }, [questionText, question.level, levelLabel, showAnswer, actionTrigger, displayedText, displayedLevel]);

  const animatedStyle = React.useMemo(() => {
    const cardInterpolate = flipAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
    return {
      transform: [{ translateX: slideAnim }, { rotateY: cardInterpolate }],
    };
  }, [flipAnim, slideAnim]);

  return (
    <View style={[styles.cardContainer, containerStyle]}>
      <View style={[styles.cardShadow, { backgroundColor: theme.border }]} />
      <Animated.View
        style={[
          styles.cardFront,
          { backgroundColor: theme.surface, borderColor: theme.border },
          animatedStyle,
        ]}
      >
        <View style={styles.categoryContainer}>
          <Text style={[styles.categoryText, { color: theme.primary }]}>{displayedLevel.toUpperCase()}</Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={[styles.questionText, { color: theme.text }]}>{displayedText}</Text>
          {timeUp && question.correctAnswer && (
            <View style={[styles.answerBelowContainer, { borderTopColor: theme.border }]}>
              <Text style={[styles.answerBelowLabel, { color: theme.muted }]}>A resposta era:</Text>
              <Text style={[styles.answerBelowText, { color: theme.accent }]}>{question.correctAnswer}</Text>
            </View>
          )}
        </View>

        {!timeUp && showAnswerButton && (
          <View style={styles.buttonWrapper}>
            <BrutalButton variant="surface" size="large" onPress={onToggleAnswer} style={styles.answerButton}>
              {showAnswer ? (
                <EyeOff size={isTablet ? 28 : 24} color={theme.text} style={{ marginRight: 10 }} />
              ) : (
                <Eye size={isTablet ? 28 : 24} color={theme.text} style={{ marginRight: 10 }} />
              )}
              <Text style={[styles.buttonLabel, { color: theme.text }]}>
                {showAnswer ? 'Esconder Resposta' : 'Ver Resposta'}
              </Text>
            </BrutalButton>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default QuestionCard;
