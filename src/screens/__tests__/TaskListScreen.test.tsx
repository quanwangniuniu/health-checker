import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import TaskListScreen from '../TaskListScreen';
import { DatabaseService } from '../../services/database';

jest.mock('../../services/database');

describe('TaskListScreen', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Test Task 1',
      description: 'Test Description 1',
      dueDate: '2024-04-25',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Test Task 2',
      description: 'Test Description 2',
      dueDate: '2024-04-26',
      status: 'completed',
    },
  ];

  beforeEach(() => {
    (DatabaseService as jest.Mock).mockImplementation(() => ({
      getAllTasks: jest.fn().mockResolvedValue(mockTasks),
      deleteTask: jest.fn().mockResolvedValue(undefined),
    }));
  });

  it('should render task list', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <TaskListScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Test Task 1')).toBeTruthy();
      expect(getByText('Test Task 2')).toBeTruthy();
    });
  });

  it('should handle task deletion', async () => {
    const { getByText, queryByText } = render(
      <NavigationContainer>
        <TaskListScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Test Task 1')).toBeTruthy();
    });

    const deleteButton = getByText('Delete');
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(queryByText('Test Task 1')).toBeNull();
    });
  });
}); 