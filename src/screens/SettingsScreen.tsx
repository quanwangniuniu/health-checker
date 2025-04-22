import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

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

const SettingItem: React.FC<{ item: SettingItem }> = ({ item }) => {
  const renderRightComponent = () => {
    switch (item.type) {
      case 'toggle':
        return <Switch value={item.value} onValueChange={() => {}} />;
      case 'navigation':
        return (
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        );
      case 'button':
        return (
          <TouchableOpacity>
            <Ionicons name={item.icon} size={24} color={theme.colors.error} />
          </TouchableOpacity>
        );
    }
  };

  return (
    <TouchableOpacity style={styles.settingItem}>
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
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.content}>
        {settings.map((item) => (
          <SettingItem key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
}); 