import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './src/constants/theme';

// Import screens
import TaskListScreen from './src/screens/TaskListScreen';
import TaskInputScreen from './src/screens/TaskInputScreen';
import HealthTrackingScreen from './src/screens/HealthTrackingScreen';
import LocationScreen from './src/screens/LocationScreen';
import InspirationScreen from './src/screens/InspirationScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HealthEducationScreen from './src/screens/HealthEducationScreen';

// Define navigation types
export type RootStackParamList = {
  Tasks: undefined;
  Health: undefined;
  Location: undefined;
  Inspiration: undefined;
  Settings: undefined;
  HealthEducation: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createStackNavigator();

function TasksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TaskList" 
        component={TaskListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="TaskInput" 
        component={TaskInputScreen}
        options={{ title: 'New Task' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = '';

            if (route.name === 'Tasks') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Health') {
              iconName = focused ? 'fitness' : 'fitness-outline';
            } else if (route.name === 'Location') {
              iconName = focused ? 'location' : 'location-outline';
            } else if (route.name === 'Inspiration') {
              iconName = focused ? 'bulb' : 'bulb-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'HealthEducation') {
              iconName = focused ? 'book' : 'book-outline';
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text,
          tabBarStyle: {
            backgroundColor: theme.colors.card,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
          },
          headerStyle: {
            backgroundColor: theme.colors.card,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          },
          headerTitleStyle: {
            color: theme.colors.text,
          },
        })}
      >
        <Tab.Screen
          name="Tasks"
          component={TasksStack}
          options={{
            title: 'Tasks',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Health"
          component={HealthTrackingScreen}
          options={{
            title: 'Health',
          }}
        />
        <Tab.Screen
          name="HealthEducation"
          component={HealthEducationScreen}
          options={{
            title: 'Education',
          }}
        />
        <Tab.Screen
          name="Location"
          component={LocationScreen}
          options={{
            title: 'Locations',
          }}
        />
        <Tab.Screen
          name="Inspiration"
          component={InspirationScreen}
          options={{
            title: 'Inspiration',
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 