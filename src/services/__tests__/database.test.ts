import { openDatabase } from 'react-native-sqlite-storage';
import { DatabaseService } from '../database';

jest.mock('react-native-sqlite-storage');

describe('DatabaseService', () => {
  let dbService: DatabaseService;

  beforeEach(() => {
    dbService = new DatabaseService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should create the database and tables', async () => {
      const mockDb = {
        transaction: jest.fn((callback) => {
          callback({
            executeSql: jest.fn(),
          });
        }),
      };

      (openDatabase as jest.Mock).mockReturnValue(mockDb);

      await dbService.initialize();

      expect(openDatabase).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'SmartLifeAssistant.db',
          location: 'default',
        })
      );

      expect(mockDb.transaction).toHaveBeenCalled();
    });
  });

  describe('CRUD operations', () => {
    it('should add a task', async () => {
      const mockDb = {
        transaction: jest.fn((callback) => {
          callback({
            executeSql: jest.fn(),
          });
        }),
      };

      (openDatabase as jest.Mock).mockReturnValue(mockDb);
      await dbService.initialize();

      const task = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-04-25',
        status: 'pending',
      };

      await dbService.addTask(task);

      expect(mockDb.transaction).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it('should get all tasks', async () => {
      const mockDb = {
        transaction: jest.fn((callback) => {
          callback({
            executeSql: jest.fn((query, params, success, error) => {
              success(null, {
                rows: {
                  length: 1,
                  item: jest.fn((index) => ({
                    id: 1,
                    title: 'Test Task',
                    description: 'Test Description',
                    dueDate: '2024-04-25',
                    status: 'pending',
                  })),
                },
              });
            }),
          });
        }),
      };

      (openDatabase as jest.Mock).mockReturnValue(mockDb);
      await dbService.initialize();

      const tasks = await dbService.getAllTasks();

      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toEqual(
        expect.objectContaining({
          title: 'Test Task',
          description: 'Test Description',
        })
      );
    });
  });
}); 