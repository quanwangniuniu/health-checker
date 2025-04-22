import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { theme } from '../constants/theme';

interface CheckIn {
  id: number;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export default function LocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Get current location
  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
      });
      setLocation(location);
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Failed to get location');
      return null;
    }
  };

  // Initialize location tracking
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        // Get initial location
        await getCurrentLocation();

        // Set up location watcher
        const locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 5,
          },
          (newLocation) => {
            setLocation(newLocation);
          }
        );

        // Cleanup subscription
        return () => {
          locationSubscription.remove();
        };
      } catch (error) {
        console.error('Error setting up location:', error);
        setErrorMsg('Failed to set up location tracking');
      }
    })();
  }, []);

  // Handle check-in
  const handleCheckIn = async () => {
    if (!location) {
      Alert.alert('Error', 'Location not available');
      return;
    }

    setLoading(true);
    try {
      // Create new check-in
      const newCheckIn: CheckIn = {
        id: Date.now(),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date().toISOString(),
      };

      // Add to check-ins list
      setCheckIns(prev => [newCheckIn, ...prev]);

      // Show success message
      Alert.alert('Success', 'Check-in successful!');
    } catch (error) {
      console.error('Error during check-in:', error);
      Alert.alert('Error', 'Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <Text style={styles.title}>Current Location</Text>
        
        {errorMsg ? (
          <Text style={styles.error}>{errorMsg}</Text>
        ) : location ? (
          <View style={styles.locationInfo}>
            <View style={styles.coordinates}>
              <Text style={styles.label}>Coordinates:</Text>
              <Text style={styles.text}>
                {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
              </Text>
            </View>
            <View style={styles.accuracy}>
              <Text style={styles.label}>Accuracy:</Text>
              <Text style={styles.text}>{location.coords.accuracy?.toFixed(2)} meters</Text>
            </View>
          </View>
        ) : (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        )}

        <TouchableOpacity
          style={[
            styles.checkInButton,
            (!location || loading) && styles.checkInButtonDisabled
          ]}
          onPress={handleCheckIn}
          disabled={!location || loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.card} />
          ) : (
            <>
              <Ionicons name="location" size={24} color={theme.colors.card} />
              <Text style={styles.checkInButtonText}>Check In</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.title}>Check-in History</Text>
        {checkIns.length === 0 ? (
          <Text style={styles.emptyText}>No check-ins yet</Text>
        ) : (
          checkIns.map(checkIn => (
            <View key={checkIn.id} style={styles.checkInCard}>
              <View style={styles.checkInHeader}>
                <Text style={styles.checkInTime}>{formatDate(checkIn.timestamp)}</Text>
                <Ionicons name="location" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.checkInCoordinates}>
                {checkIn.latitude.toFixed(6)}, {checkIn.longitude.toFixed(6)}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  locationContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  locationInfo: {
    marginBottom: theme.spacing.md,
  },
  coordinates: {
    marginBottom: theme.spacing.sm,
  },
  accuracy: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  text: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.typography.body.fontSize,
    marginBottom: theme.spacing.md,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  checkInButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  checkInButtonText: {
    color: theme.colors.card,
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
  },
  emptyText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  checkInCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  checkInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  checkInTime: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text,
  },
  checkInCoordinates: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text,
  },
}); 