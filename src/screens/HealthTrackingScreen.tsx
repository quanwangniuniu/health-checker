import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';

// Define types for our health data
type Trend = 'up' | 'down' | 'stable';

interface HealthMetric {
  value: number;
  target: number;
  trend: Trend;
  unit: string;
}

interface HealthData {
  sleep: HealthMetric;
  water: HealthMetric;
  steps: HealthMetric;
  heartRate: HealthMetric;
  sleepQuality: HealthMetric;
}

// Dummy data for health metrics
const healthData: HealthData = {
  sleep: {
    value: 7.5,
    target: 8,
    trend: 'up',
    unit: 'h',
  },
  water: {
    value: 2.5,
    target: 3,
    trend: 'down',
    unit: 'L',
  },
  steps: {
    value: 8500,
    target: 10000,
    trend: 'up',
    unit: '',
  },
  heartRate: {
    value: 72,
    target: 60,
    trend: 'stable',
    unit: 'bpm',
  },
  sleepQuality: {
    value: 85,
    target: 90,
    trend: 'up',
    unit: '%',
  },
};

// Dummy data for charts
const heartRateData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [72, 75, 70, 68, 72, 69, 71],
      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

const sleepQualityData = [
  {
    name: 'Deep',
    value: 30,
    color: '#4CAF50',
    legendFontColor: theme.colors.text,
    legendFontSize: 12,
  },
  {
    name: 'Light',
    value: 40,
    color: '#2196F3',
    legendFontColor: theme.colors.text,
    legendFontSize: 12,
  },
  {
    name: 'REM',
    value: 20,
    color: '#FFC107',
    legendFontColor: theme.colors.text,
    legendFontSize: 12,
  },
  {
    name: 'Awake',
    value: 10,
    color: '#F44336',
    legendFontColor: theme.colors.text,
    legendFontSize: 12,
  },
];

const chartConfig = {
  backgroundGradientFrom: theme.colors.card,
  backgroundGradientTo: theme.colors.card,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
};

interface HealthMetricCardProps {
  title: string;
  value: number;
  target: number;
  unit: string;
  trend: Trend;
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({ title, value, target, unit, trend }) => {
  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return theme.colors.success;
    if (percentage >= 75) return theme.colors.warning;
    return theme.colors.error;
  };

  const getTrendIcon = (trend: Trend) => {
    switch (trend) {
      case 'up':
        return <Ionicons name="arrow-up" size={20} color={theme.colors.success} />;
      case 'down':
        return <Ionicons name="arrow-down" size={20} color={theme.colors.error} />;
      default:
        return <Ionicons name="remove" size={20} color={theme.colors.warning} />;
    }
  };

  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle}>{title}</Text>
        {getTrendIcon(trend)}
      </View>
      <View style={styles.metricValueContainer}>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricUnit}>{unit}</Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min((value / target) * 100, 100)}%`,
              backgroundColor: getProgressColor(value, target),
            },
          ]}
        />
      </View>
      <Text style={styles.targetText}>Target: {target}{unit}</Text>
    </View>
  );
};

interface HealthDataInput {
  type: 'sleep' | 'heartRate' | 'water' | 'steps';
  value: string;
  date: Date;
}

export default function HealthTrackingScreen() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'heart' | 'sleep'>('overview');
  const [showInputModal, setShowInputModal] = useState(false);
  const [inputData, setInputData] = useState<HealthDataInput>({
    type: 'sleep',
    value: '',
    date: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [healthData, setHealthData] = useState<HealthData>({
    sleep: {
      value: 7.5,
      target: 8,
      trend: 'up',
      unit: 'h',
    },
    water: {
      value: 2.5,
      target: 3,
      trend: 'down',
      unit: 'L',
    },
    steps: {
      value: 8500,
      target: 10000,
      trend: 'up',
      unit: '',
    },
    heartRate: {
      value: 72,
      target: 60,
      trend: 'stable',
      unit: 'bpm',
    },
    sleepQuality: {
      value: 85,
      target: 90,
      trend: 'up',
      unit: '%',
    },
  });
  const [healthRecords, setHealthRecords] = useState<{
    sleep: { value: number; date: Date }[];
    heartRate: { value: number; date: Date }[];
    water: { value: number; date: Date }[];
    steps: { value: number; date: Date }[];
  }>({
    sleep: [],
    heartRate: [],
    water: [],
    steps: [],
  });

  const handleAddRecord = () => {
    if (!inputData.value) return;

    const newRecord = {
      value: parseFloat(inputData.value),
      date: inputData.date,
    };

    setHealthRecords(prev => ({
      ...prev,
      [inputData.type]: [...prev[inputData.type], newRecord],
    }));

    // Update healthData with the latest record
    const updatedHealthData = { ...healthData };
    updatedHealthData[inputData.type].value = newRecord.value;
    setHealthData(updatedHealthData);

    setShowInputModal(false);
    setInputData({ type: 'sleep', value: '', date: new Date() });
  };

  const renderInputModal = () => (
    <Modal
      visible={showInputModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowInputModal(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Health Record</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Type</Text>
            <View style={styles.typeSelector}>
              {(['sleep', 'heartRate', 'water', 'steps'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    inputData.type === type && styles.selectedTypeButton,
                  ]}
                  onPress={() => setInputData(prev => ({ ...prev, type }))}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      inputData.type === type && styles.selectedTypeButtonText,
                    ]}
                  >
                    {type === 'sleep' ? 'Sleep' :
                     type === 'heartRate' ? 'Heart Rate' :
                     type === 'water' ? 'Water' : 'Steps'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Value</Text>
            <TextInput
              style={styles.input}
              value={inputData.value}
              onChangeText={value => setInputData(prev => ({ ...prev, value }))}
              keyboardType="numeric"
              placeholder={`Enter ${inputData.type === 'sleep' ? 'hours' :
                           inputData.type === 'heartRate' ? 'bpm' :
                           inputData.type === 'water' ? 'liters' : 'steps'}`}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {inputData.date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={inputData.date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setInputData(prev => ({ ...prev, date: selectedDate }));
                }
              }}
            />
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowInputModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleAddRecord}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Tracking</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowInputModal(true)}
        >
          <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'overview' && styles.selectedTab]}
          onPress={() => setSelectedTab('overview')}
        >
          <Text style={[styles.tabText, selectedTab === 'overview' && styles.selectedTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'heart' && styles.selectedTab]}
          onPress={() => setSelectedTab('heart')}
        >
          <Text style={[styles.tabText, selectedTab === 'heart' && styles.selectedTabText]}>
            Heart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'sleep' && styles.selectedTab]}
          onPress={() => setSelectedTab('sleep')}
        >
          <Text style={[styles.tabText, selectedTab === 'sleep' && styles.selectedTabText]}>
            Sleep
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {selectedTab === 'overview' && (
          <>
            <HealthMetricCard
              title="Sleep"
              value={healthData.sleep.value}
              target={healthData.sleep.target}
              unit={healthData.sleep.unit}
              trend={healthData.sleep.trend}
            />
            <HealthMetricCard
              title="Water Intake"
              value={healthData.water.value}
              target={healthData.water.target}
              unit={healthData.water.unit}
              trend={healthData.water.trend}
            />
            <HealthMetricCard
              title="Steps"
              value={healthData.steps.value}
              target={healthData.steps.target}
              unit={healthData.steps.unit}
              trend={healthData.steps.trend}
            />
          </>
        )}

        {selectedTab === 'heart' && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Heart Rate Trend</Text>
            <LineChart
              data={heartRateData}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
            <HealthMetricCard
              title="Average Heart Rate"
              value={healthData.heartRate.value}
              target={healthData.heartRate.target}
              unit={healthData.heartRate.unit}
              trend={healthData.heartRate.trend}
            />
          </View>
        )}

        {selectedTab === 'sleep' && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Sleep Quality</Text>
            <PieChart
              data={sleepQualityData}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
            <HealthMetricCard
              title="Sleep Quality"
              value={healthData.sleepQuality.value}
              target={healthData.sleepQuality.target}
              unit={healthData.sleepQuality.unit}
              trend={healthData.sleepQuality.trend}
            />
          </View>
        )}
      </ScrollView>

      {renderInputModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    padding: theme.spacing.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  selectedTabText: {
    color: theme.colors.primary,
    fontWeight: 'bold' as const,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  metricCard: {
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
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  metricTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginRight: theme.spacing.xs,
  },
  metricUnit: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
  },
  targetText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text,
  },
  chartContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  chartTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  chart: {
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  typeButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
  },
  selectedTypeButton: {
    backgroundColor: theme.colors.primary,
  },
  typeButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
  },
  selectedTypeButtonText: {
    color: theme.colors.card,
  },
  dateButton: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
  },
  dateButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  modalButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.background,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
  },
  saveButtonText: {
    color: theme.colors.card,
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
  },
}); 