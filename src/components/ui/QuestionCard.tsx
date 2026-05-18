import BrutalButton from '@/components/ui/BrutalButton';
import { Question } from '@/constants/questions';
import { Colors, Fonts, Metrics } from '@/constants/theme';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

interface QuestionCardProps {
  question: Question;
  levelLabel: string;
  actionTrigger: 'slide' | 'flip' | null;
  showAnswerButton?: boolean;
  timeUp?: boolean;
  showAnswer?: boolean;
  onToggleAnswer?: () => void;
}

const LEVEL_DISPLAY_NAMES: Record<string, string> = {
  multidao: 'Multidão',
  discipulo: 'Discípulo',
  apostolo: 'Apóstolo',
  comunhao: 'Comunhão',
  testemunho: 'Testemunho',
  confissao: 'Confissão',
};

export default function QuestionCard({
  question,
  levelLabel,
  actionTrigger,
  showAnswerButton = false,
  timeUp,
  showAnswer = false,
  onToggleAnswer,
}: QuestionCardProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  const questionText = timeUp ? "Tempo Esgotado!" : showAnswer ? question.correctAnswer : question.text;

  const getInitialLevelLabel = () => {
    const rawLevel = question.level || levelLabel || 'multidao';
    const levelName = LEVEL_DISPLAY_NAMES[rawLevel.toLowerCase()] || rawLevel;
    return showAnswer ? `${levelName} - Resposta` : levelName;
  };

  const [displayedText, setDisplayedText] = useState(questionText || '');
  const [displayedLevel, setDisplayedLevel] = useState(getInitialLevelLabel());

  useEffect(() => {
    const rawLevel = question.level || levelLabel || 'multidao';
    const levelName = LEVEL_DISPLAY_NAMES[rawLevel.toLowerCase()] || rawLevel;
    const currentLevelLabel = showAnswer ? `${levelName} - Resposta` : levelName;

    if (questionText === displayedText && currentLevelLabel === displayedLevel) return;

    if (actionTrigger === 'slide') {
      // Slide out to the left
      Animated.timing(slideAnim, {
        toValue: -Dimensions.get('window').width,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setDisplayedText(questionText || '');
        setDisplayedLevel(currentLevelLabel);
        // Instant teleport to the right
        slideAnim.setValue(Dimensions.get('window').width);
        // Slide back into center
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }).start();
      });
    } else if (actionTrigger === 'flip') {
      // Flip card rotation
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setDisplayedText(questionText || '');
        setDisplayedLevel(currentLevelLabel);
        // Return flip back
        Animated.timing(flipAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Immediate update fallback
      setDisplayedText(questionText || '');
      setDisplayedLevel(currentLevelLabel);
    }
  }, [questionText, question.level, levelLabel, showAnswer, actionTrigger]);

  const cardInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const animatedStyle = {
    transform: [
      { translateX: slideAnim },
      { rotateY: cardInterpolate },
    ],
  };

  return (
    <View style={styles.cardContainer}>
      {/* Hard drop shadow */}
      <View style={styles.cardShadow} />

      {/* Animated Front card */}
      <Animated.View style={[styles.cardFront, animatedStyle]}>

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{displayedLevel.toUpperCase()}</Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {displayedText}
          </Text>
        </View>

        {!timeUp && showAnswerButton && (
          <View style={styles.buttonWrapper}>
            <BrutalButton variant="surface" size="large" onPress={onToggleAnswer} style={styles.answerButton}>
              {showAnswer
                ? <EyeOff size={24} color={Colors.text} style={{ marginRight: 10 }} />
                : <Eye size={24} color={Colors.text} style={{ marginRight: 10 }} />
              }
              <Text style={styles.buttonLabel}>{showAnswer ? 'Esconder Resposta' : 'Ver Resposta'}</Text>
            </BrutalButton>
          </View>
        )}
      </Animated.View>
    </View>
  );
}


const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    width: '100%',
    height: '60%',
    marginBottom: Metrics.shadowOffset * 2,
  },
  cardShadow: {
    position: 'absolute',
    top: Metrics.shadowOffset * 2,
    left: Metrics.shadowOffset * 2,
    right: -Metrics.shadowOffset * 2,
    bottom: -Metrics.shadowOffset * 2,
    backgroundColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    zIndex: 1,
  },
  cardFront: {
    zIndex: 2,
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    borderRadius: Metrics.radiusCard,
    alignItems: 'center',
    padding: 24,
    justifyContent: 'flex-start',
    backfaceVisibility: 'hidden',
  },
  categoryContainer: {
    marginBottom: 10,
  },
  categoryText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Colors.primary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontFamily: Fonts.heading,
    fontSize: 34,
    textAlign: 'center',
    lineHeight: 42,
    color: Colors.text,
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 20,
  },
  answerButton: {
    marginBottom: 0,
  },
  buttonLabel: {
    fontFamily: Fonts.subheading,
    fontSize: 18,
    color: Colors.text,
  },
});
