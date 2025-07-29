import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddHouseScreen from './src/screens/AddHouseScreen';
import HouseDetailScreen from './src/screens/HouseDetailScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ContactScreen from './src/screens/ContactScreen';
import HelpScreen from './src/screens/HelpScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerStyle: { backgroundColor: '#007AFF' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />

          {!user && (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          )}

          {user && (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Property Manager', headerLeft: null }}
              />
              <Stack.Screen
                name="AddHouse"
                component={AddHouseScreen}
                options={{ title: 'Add Property' }}
              />
              <Stack.Screen
                name="HouseDetail"
                component={HouseDetailScreen}
                options={{ title: 'Property Details' }}
              />
              <Stack.Screen
                name="Explore"
                component={ExploreScreen}
                options={{ title: 'Explore Properties' }}
              />
              <Stack.Screen
                name="Wishlist"
                component={WishlistScreen}
                options={{ title: 'Your Wishlist' }}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Your Profile' }}
              />
              <Stack.Screen
                name="Help"
                component={HelpScreen}
                options={{ title: 'Help Center' }}
              />
              <Stack.Screen
                name="Contact"
                component={ContactScreen}
                options={{ title: 'Contact Us' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>

      {/* ✅ Global Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
