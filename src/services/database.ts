import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

export class DatabaseService {
  private readonly TASKS_KEY = '@tasks';

  async initialize(): Promise<void> {
    // No initialization needed for AsyncStorage
  }

  async addTask(task: Omit<Task, 'id'>): Promise<number> {
    const tasks = await this.getAllTasks();
    const newTask: Task = {
      ...task,
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id || 0)) + 1 : 1
    };
    tasks.push(newTask);
    await AsyncStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    return newTask.id!;
  }

  async getAllTasks(): Promise<Task[]> {
    const tasksJson = await AsyncStorage.getItem(this.TASKS_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  }

  async updateTask(task: Task): Promise<void> {
    const tasks = await this.getAllTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks[index] = task;
      await AsyncStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    }
  }

  async deleteTask(id: number): Promise<void> {
    const tasks = await this.getAllTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    await AsyncStorage.setItem(this.TASKS_KEY, JSON.stringify(filteredTasks));
  }
} 