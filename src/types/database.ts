import { SQLiteDatabase } from 'react-native-sqlite-storage';

export interface Task {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
}

export interface DatabaseTransaction {
  executeSql: (
    sql: string,
    args?: any[],
    success?: (transaction: any, resultSet: any) => void,
    error?: (transaction: any, error: any) => boolean
  ) => void;
}

export interface DatabaseResultSet {
  insertId: number;
  rows: {
    length: number;
    item: (index: number) => any;
  };
} 