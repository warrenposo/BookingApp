import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddHouseScreen from './src/screens/AddHouseScreen';
import HouseDetailScreen from './src/screens/HouseDetailScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Property Manager',
                headerLeft: null,
              }}
            />
            <Stack.Screen
              name="AddHouse"
              component={AddHouseScreen}
              options={{
                title: 'Add Property',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen
              name="HouseDetail"
              component={HouseDetailScreen}
              options={{
                title: 'Property Details',
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Welcome',
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
