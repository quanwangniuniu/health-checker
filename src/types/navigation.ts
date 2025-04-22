import { NavigatorScreenParams } from '@react-navigation/native';
import { Task } from '../services/database';

export type RootStackParamList = {
  TaskList: undefined;
  TaskInput: { task?: Task };
  Settings: undefined;
};

export type MainTabParamList = {
  TaskList: undefined;
  Settings: undefined;
};

export type Priority = 'high' | 'medium' | 'low';
export type Status = 'pending' | 'completed'; 