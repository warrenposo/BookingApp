import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Info', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email.trim(), password.trim());
        Alert.alert('Success', 'Sign up successful! Please check your email for confirmation.');
        setIsSignUp(false);
      } else {
        await signIn(email.trim(), password.trim());
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? (isSignUp ? 'Signing up...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Login')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.toggleButton}>
        <Text style={styles.toggleText}>
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  toggleButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  toggleText: {
    color: '#007AFF',
    fontWeight: '500',
  },
});
