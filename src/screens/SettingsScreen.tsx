import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions, Platform } from 'react-native';
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
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

// Define types for settings
type SettingType = 'toggle' | 'navigation' | 'button';
type IconName = 'moon-outline' | 'notifications-outline' | 'cloud-upload-outline' | 'shield-outline' | 'information-circle-outline' | 'log-out-outline' | 'chevron-forward';

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  type: SettingType;
  value?: boolean;
  icon: IconName;
}

// Dummy data for settings
const settings: SettingItem[] = [
  {
    id: '1',
    title: 'Dark Mode',
    description: 'Enable dark theme for the app',
    type: 'toggle',
    value: false,
    icon: 'moon-outline',
  },
  {
    id: '2',
    title: 'Notifications',
    description: 'Manage notification settings',
    type: 'navigation',
    icon: 'notifications-outline',
  },
  {
    id: '3',
    title: 'Data Backup',
    description: 'Backup your data to cloud',
    type: 'navigation',
    icon: 'cloud-upload-outline',
  },
  {
    id: '4',
    title: 'Privacy',
    description: 'Manage privacy settings',
    type: 'navigation',
    icon: 'shield-outline',
  },
  {
    id: '5',
    title: 'About',
    description: 'App version and information',
    type: 'navigation',
    icon: 'information-circle-outline',
  },
  {
    id: '6',
    title: 'Logout',
    type: 'button',
    icon: 'log-out-outline',
  },
];

// Animated Setting Item Component
const AnimatedSettingItem: React.FC<{ item: SettingItem; index: number }> = ({ item, index }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  // Entrance animation
  useEffect(() => {
    opacity.value = withDelay(
      index * 100,
      withTiming(1, { duration: 500 })
    );
    translateY.value = withDelay(
      index * 100,
      withSpring(0, {
        damping: 12,
        stiffness: 100,
      })
    );
  }, []);

  // Ripple effect animation
  const handlePress = () => {
    rippleScale.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0, { duration: 300 })
    );
    rippleOpacity.value = withSequence(
      withTiming(0.3, { duration: 150 }),
      withTiming(0, { duration: 300 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const gesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.98);
    })
    .onFinalize(() => {
      scale.value = withSpring(1);
      runOnJS(handlePress)();
    });

  const renderRightComponent = () => {
    switch (item.type) {
      case 'toggle':
        return <AnimatedSwitch value={item.value} onValueChange={() => {}} />;
      case 'navigation':
        return (
          <Animated.View style={styles.chevronContainer}>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
          </Animated.View>
        );
      case 'button':
        return (
          <Animated.View style={styles.logoutContainer}>
            <Ionicons name={item.icon} size={24} color={theme.colors.error} />
          </Animated.View>
        );
    }
  };

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.settingItem, animatedStyle]}>
        <Animated.View style={[styles.ripple, rippleStyle]} />
        <View style={styles.settingIcon}>
          <Ionicons
            name={item.icon}
            size={24}
            color={item.type === 'button' ? theme.colors.error : theme.colors.primary}
          />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.settingDescription}>{item.description}</Text>
          )}
        </View>
        {renderRightComponent()}
      </Animated.View>
    </GestureDetector>
  );
};

// Animated Switch Component
const AnimatedSwitch: React.FC<{ value?: boolean; onValueChange: (value: boolean) => void }> = ({ value = false, onValueChange }) => {
  const switchScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: switchScale.value }],
  }));

  const handlePress = () => {
    switchScale.value = withSequence(
      withSpring(0.8),
      withSpring(1)
    );
    onValueChange(!value);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors.card}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
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
          <Text style={styles.headerTitle}>Settings</Text>
        </Animated.View>
        <View style={styles.content}>
          {settings.map((item, index) => (
            <AnimatedSettingItem key={item.id} item={item} index={index} />
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
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
  },
  content: {
    padding: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  settingIcon: {
    marginRight: theme.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingDescription: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text,
  },
  chevronContainer: {
    padding: theme.spacing.xs,
  },
  logoutContainer: {
    padding: theme.spacing.xs,
  },
}); 