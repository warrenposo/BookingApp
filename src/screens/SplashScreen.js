import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function SplashScreen({ navigation }) {
  const { user, loading } = useAuth();

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          navigation.replace('Home');
        } else {
          navigation.replace('Login');
        }
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation, user, loading]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/icon.png')}
        style={[
          styles.logo,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
        ]}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007',
  },
  logo: {
    width: 220,
    height: 220,
  },
  spinner: {
    marginTop: 30,
  },
});
