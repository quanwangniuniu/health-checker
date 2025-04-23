import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolate,
  runOnJS,
  Easing,
  withRepeat,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import CircularProgress from 'react-native-circular-progress-indicator';
import Markdown from 'react-native-markdown-display';
import Svg, { Circle, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Define types for health education content
interface HealthTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  content: {
    text: string[];
    charts?: any;
    progress?: number;
    tips?: string[];
    schedule?: { day: string; activities: string[] }[];
  };
  animationType: 'slide' | 'rotate' | 'pulse' | 'wave';
}

// Sample health education data with enhanced content
const healthTopics: HealthTopic[] = [
  {
    id: '1',
    title: 'Nutrition & Diet',
    description: 'Learn about balanced nutrition and healthy eating habits',
    icon: 'nutrition',
    color: '#FF9F1C',
    animationType: 'slide',
    content: {
      text: [
        'A balanced diet includes fruits, vegetables, whole grains, and lean proteins',
        'Stay hydrated by drinking at least 8 glasses of water daily',
      ],
      charts: {
        macronutrients: {
          data: [
            { name: 'Proteins', percentage: 30, color: '#FF9F1C' },
            { name: 'Carbs', percentage: 40, color: '#2EC4B6' },
            { name: 'Fats', percentage: 30, color: '#E71D36' },
          ],
        },
        weeklyIntake: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            data: [2000, 2200, 1800, 2100, 2300, 2400, 2000],
          }],
        },
      },
      tips: [
        '🥗 Eat a rainbow of vegetables daily',
        '💧 Track your water intake',
        '🍎 Choose whole fruits over juices',
        '🥩 Include lean proteins in every meal',
      ],
    },
  },
  {
    id: '2',
    title: 'Physical Activity',
    description: 'Discover the benefits of regular exercise',
    icon: 'fitness',
    color: '#2EC4B6',
    animationType: 'rotate',
    content: {
      text: [
        'Regular exercise improves cardiovascular health',
        'Strength training builds muscle and bone density',
      ],
      progress: 75,
      schedule: [
        { 
          day: 'Monday',
          activities: ['Cardio - 30min', 'Core workout - 15min']
        },
        {
          day: 'Wednesday',
          activities: ['Strength training - 45min', 'Yoga - 20min']
        },
        {
          day: 'Friday',
          activities: ['HIIT - 25min', 'Stretching - 15min']
        },
      ],
      charts: {
        weeklyActivity: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            data: [45, 30, 65, 20, 55, 40, 35],
          }],
        },
      },
    },
  },
  {
    id: '3',
    title: 'Mental Wellness',
    description: 'Tips for maintaining good mental health',
    icon: 'happy',
    color: '#E71D36',
    animationType: 'pulse',
    content: {
      text: [
        'Practice mindfulness and meditation daily',
        'Maintain healthy social connections',
      ],
      charts: {
        moodTracker: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            data: [8, 7, 6, 8, 9, 8, 7],
          }],
        },
      },
      tips: [
        '🧘‍♀️ 10 minutes daily meditation',
        '📝 Journal your thoughts',
        '👥 Connect with friends and family',
        '🌳 Spend time in nature',
      ],
    },
  },
  {
    id: '4',
    title: 'Sleep Hygiene',
    description: 'Improve your sleep quality and habits',
    icon: 'moon',
    color: '#6B4BFF',
    animationType: 'wave',
    content: {
      text: [
        'Maintain a consistent sleep schedule',
        'Create a relaxing bedtime routine',
      ],
      charts: {
        sleepQuality: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            data: [7.5, 8, 6.5, 7, 8.5, 9, 8],
          }],
        },
      },
      tips: [
        '🌙 Set a consistent bedtime',
        '📱 No screens 1 hour before bed',
        '🛏️ Keep bedroom cool and dark',
        '🧘‍♀️ Practice relaxation techniques',
      ],
    },
  },
];

// Custom chart configurations
const chartConfig = {
  backgroundGradientFrom: theme.colors.card,
  backgroundGradientTo: theme.colors.card,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

// Animated components for different animation types
const SlideContent: React.FC<{ content: any; color: string }> = ({ content, color }) => {
  const translateX = useSharedValue(-SCREEN_WIDTH);
  
  useEffect(() => {
    translateX.value = withSpring(0, {
      damping: 15,
      stiffness: 90,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <LineChart
        data={content.charts.weeklyIntake}
        width={SCREEN_WIDTH - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
      />
    </Animated.View>
  );
};

const RotateContent: React.FC<{ content: any; color: string }> = ({ content, color }) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
    scale.value = withSpring(1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <CircularProgress
        value={content.progress}
        radius={80}
        duration={2000}
        progressValueColor={color}
        activeStrokeColor={color}
        inActiveStrokeColor={`${color}50`}
      />
    </Animated.View>
  );
};

const PulseContent: React.FC<{ content: any; color: string }> = ({ content, color }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <BarChart
        data={content.charts.moodTracker}
        width={SCREEN_WIDTH - 40}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        yAxisLabel=""
        yAxisSuffix=""
      />
    </Animated.View>
  );
};

const WaveContent: React.FC<{ content: any; color: string }> = ({ content, color }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -10]) },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <LineChart
        data={content.charts.sleepQuality}
        width={SCREEN_WIDTH - 40}
        height={220}
        chartConfig={{
          ...chartConfig,
          color: (opacity = 1) => color,
        }}
        bezier
      />
    </Animated.View>
  );
};

// Enhanced Animated Card Component
const AnimatedCard: React.FC<{ topic: HealthTopic; index: number }> = ({ topic, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardScale = useSharedValue(1);
  const cardRotation = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  // Entrance animation
  useEffect(() => {
    opacity.value = withDelay(
      index * 200,
      withTiming(1, { duration: 500 })
    );
    translateY.value = withDelay(
      index * 200,
      withSpring(0, {
        damping: 12,
        stiffness: 100,
      })
    );
  }, []);

  const handlePress = () => {
    setIsExpanded(!isExpanded);
    cardScale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );
    cardRotation.value = withSpring(isExpanded ? 0 : 5);
    contentHeight.value = withSpring(isExpanded ? 0 : 1);
    contentOpacity.value = withTiming(isExpanded ? 0 : 1, { duration: 300 });
  };

  const renderAnimatedContent = () => {
    switch (topic.animationType) {
      case 'slide':
        return <SlideContent content={topic.content} color={topic.color} />;
      case 'rotate':
        return <RotateContent content={topic.content} color={topic.color} />;
      case 'pulse':
        return <PulseContent content={topic.content} color={topic.color} />;
      case 'wave':
        return <WaveContent content={topic.content} color={topic.color} />;
      default:
        return null;
    }
  };

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: cardScale.value },
      { rotateZ: `${cardRotation.value}deg` },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    height: interpolate(
      contentHeight.value,
      [0, 1],
      [0, 400],
      Extrapolate.CLAMP
    ),
    opacity: contentOpacity.value,
  }));

  return (
    <GestureDetector gesture={Gesture.Tap().onEnd(handlePress)}>
      <Animated.View style={[styles.card, cardStyle, { borderLeftColor: topic.color }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: topic.color }]}>
            <Ionicons name={topic.icon as any} size={24} color="white" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{topic.title}</Text>
            <Text style={styles.cardDescription}>{topic.description}</Text>
          </View>
          <Animated.View style={[styles.arrowContainer, { transform: [{ rotate: `${isExpanded ? 180 : 0}deg` }] }]}>
            <Ionicons name="chevron-down" size={24} color={theme.colors.text} />
          </Animated.View>
        </View>
        <Animated.View style={[styles.expandedContent, contentStyle]}>
          {topic.content.text.map((item, idx) => (
            <View key={idx} style={styles.contentItem}>
              <View style={[styles.bulletPoint, { backgroundColor: topic.color }]} />
              <Text style={styles.contentText}>{item}</Text>
            </View>
          ))}
          <View style={styles.chartContainer}>
            {renderAnimatedContent()}
          </View>
          {topic.content.tips && (
            <View style={styles.tipsContainer}>
              {topic.content.tips.map((tip, idx) => (
                <Text key={idx} style={[styles.tipText, { color: topic.color }]}>{tip}</Text>
              ))}
            </View>
          )}
          {topic.content.schedule && (
            <View style={styles.scheduleContainer}>
              {topic.content.schedule.map((day, idx) => (
                <View key={idx} style={styles.scheduleItem}>
                  <Text style={[styles.scheduleDay, { color: topic.color }]}>{day.day}</Text>
                  {day.activities.map((activity, actIdx) => (
                    <Text key={actIdx} style={styles.scheduleActivity}>• {activity}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default function HealthEducationScreen() {
  const headerScale = useSharedValue(0.8);
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    headerScale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
    headerOpacity.value = withTiming(1, { duration: 500 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
    opacity: headerOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <ScrollView style={styles.scrollView}>
        <Animated.View style={[styles.header, headerStyle]}>
          <Text style={styles.headerTitle}>Health Education</Text>
          <Text style={styles.headerSubtitle}>Learn about healthy living</Text>
        </Animated.View>
        <View style={styles.content}>
          {healthTopics.map((topic, index) => (
            <AnimatedCard key={topic.id} topic={topic} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...(Platform.OS === 'web' ? {
      WebkitBackdropFilter: 'blur(20px)',
      backdropFilter: 'blur(20px)',
    } : {}),
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    opacity: 0.7,
  },
  content: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    opacity: 0.7,
  },
  arrowContainer: {
    padding: theme.spacing.xs,
  },
  expandedContent: {
    marginTop: theme.spacing.md,
    overflow: 'hidden',
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  contentText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    flex: 1,
  },
  chartContainer: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  tipsContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
  },
  tipText: {
    fontSize: theme.typography.caption.fontSize,
    marginBottom: theme.spacing.xs,
  },
  scheduleContainer: {
    marginTop: theme.spacing.md,
  },
  scheduleItem: {
    marginBottom: theme.spacing.sm,
  },
  scheduleDay: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold' as const,
    marginBottom: theme.spacing.xs,
  },
  scheduleActivity: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
}); 