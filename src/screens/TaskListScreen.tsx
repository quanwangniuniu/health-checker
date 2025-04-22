import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Task, DatabaseService } from '../services/database';

type TaskListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskInput'>;

const database = new DatabaseService();

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onToggleStatus: (taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggleStatus }) => {
  return (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => onEdit(task)}
    >
      <View style={styles.taskHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.taskTitle}>{task.title}</Text>
        </View>
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => onToggleStatus(task.id!)}
        >
          <Ionicons
            name={task.status === 'completed' ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={24}
            color={task.status === 'completed' ? theme.colors.success : theme.colors.text}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.taskDescription}>{task.description}</Text>
      <View style={styles.taskFooter}>
        <Text style={styles.dueDate}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.text} />
          {' '}{task.dueDate}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(task.id!)}
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function TaskListScreen() {
  const navigation = useNavigation<TaskListScreenNavigationProp>();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from database
  const loadTasks = async () => {
    try {
      const loadedTasks = await database.getAllTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('Error', 'Failed to load tasks');
    }
  };

  // Handle task deletion
  const handleDelete = async (taskId: number) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await database.deleteTask(taskId);
              await loadTasks();
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  // Handle task status toggle
  const handleToggleStatus = async (taskId: number) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const updatedTask = {
          ...task,
          status: task.status === 'completed' ? 'pending' : 'completed'
        };
        await database.updateTask(updatedTask);
        await loadTasks();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  // Handle task edit
  const handleEdit = (task: Task) => {
    navigation.navigate('TaskInput', { task });
  };

  // Handle new task creation
  const handleAddTask = () => {
    navigation.navigate('TaskInput');
  };

  // Load tasks when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id?.toString() || ''}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
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
  listContainer: {
    padding: theme.spacing.md,
  },
  taskCard: {
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    flex: 1,
  },
  taskDescription: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  statusButton: {
    padding: theme.spacing.xs,
  },
}); 