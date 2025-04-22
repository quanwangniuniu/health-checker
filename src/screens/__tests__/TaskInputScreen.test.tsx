import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import TaskInputScreen from '../TaskInputScreen';
import { DatabaseService } from '../../services/database';

jest.mock('../../services/database');

describe('TaskInputScreen', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2024-04-25',
    status: 'pending',
  };

  beforeEach(() => {
    (DatabaseService as jest.Mock).mockImplementation(() => ({
      addTask: jest.fn().mockResolvedValue(1),
      updateTask: jest.fn().mockResolvedValue(undefined),
    }));
  });

  it('should render input form', () => {
    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <TaskInputScreen />
      </NavigationContainer>
    );

    expect(getByPlaceholderText('Title')).toBeTruthy();
    expect(getByPlaceholderText('Description')).toBeTruthy();
    expect(getByPlaceholderText('Due Date (YYYY-MM-DD)')).toBeTruthy();
  });

  it('should handle task submission', async () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <TaskInputScreen />
      </NavigationContainer>
    );

    fireEvent.changeText(getByPlaceholderText('Title'), mockTask.title);
    fireEvent.changeText(getByPlaceholderText('Description'), mockTask.description);
    fireEvent.changeText(getByPlaceholderText('Due Date (YYYY-MM-DD)'), mockTask.dueDate);

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(DatabaseService).toHaveBeenCalled();
    });
  });

  it('should handle task update', async () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <TaskInputScreen route={{ params: { task: mockTask } }} />
      </NavigationContainer>
    );

    fireEvent.changeText(getByPlaceholderText('Title'), 'Updated Title');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(DatabaseService).toHaveBeenCalled();
    });
  });
}); 