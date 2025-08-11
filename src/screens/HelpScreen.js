import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help Center</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Contact Support</Text>
        <Text style={styles.value}>support@example.com</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>+1 (555) 123-4567</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
});
