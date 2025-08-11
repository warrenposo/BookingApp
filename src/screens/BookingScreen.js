import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export default function BookingScreen({ route, navigation }) {
  const { house } = route.params;
  const [selectedDates, setSelectedDates] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleDateSelect = (date) => {
    // Simple date selection logic
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter(d => d !== date));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleBookNow = () => {
    if (selectedDates.length === 0) {
      Alert.alert('Select Dates', 'Please select at least one date for your booking.');
      return;
    }
    setShowContactModal(true);
  };

  const handleSubmitBooking = () => {
    if (!contactInfo.name || !contactInfo.phone) {
      Alert.alert('Missing Information', 'Please provide your name and phone number.');
      return;
    }

    Alert.alert(
      'Booking Request Sent!',
      'Your booking request has been sent to the property owner. They will contact you to confirm the dates and finalize the booking.',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowContactModal(false);
            navigation.goBack();
          }
        }
      ]
    );
  };

  // Generate some sample dates for demo
  const sampleDates = [
    '2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18',
    '2024-01-20', '2024-01-21', '2024-01-22', '2024-01-23',
    '2024-01-25', '2024-01-26', '2024-01-27', '2024-01-28',
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Book {house.title}</Text>
          <Text style={styles.subtitle}>
            Select your preferred dates and contact the owner
          </Text>
        </View>

        <View style={styles.dateSelection}>
          <Text style={styles.sectionTitle}>Available Dates</Text>
          <View style={styles.calendarGrid}>
            {sampleDates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateButton,
                  selectedDates.includes(date) && styles.selectedDate
                ]}
                onPress={() => handleDateSelect(date)}
              >
                <Text style={[
                  styles.dateText,
                  selectedDates.includes(date) && styles.selectedDateText
                ]}>
                  {new Date(date).getDate()}
                </Text>
                <Text style={[
                  styles.monthText,
                  selectedDates.includes(date) && styles.selectedDateText
                ]}>
                  {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bookingInfo}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>Select your preferred dates</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="mail" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>Send booking request to owner</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="call" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>Owner contacts you to confirm</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.bookButton,
            selectedDates.length === 0 && styles.disabledButton
          ]}
          onPress={handleBookNow}
          disabled={selectedDates.length === 0}
        >
          <Text style={styles.bookButtonText}>
            Book Now ({selectedDates.length} dates selected)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contact Information Modal */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Contact Information</Text>
            <Text style={styles.modalSubtitle}>
              Please provide your contact details so the property owner can reach you.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={contactInfo.name}
              onChangeText={(text) => setContactInfo({...contactInfo, name: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={contactInfo.phone}
              onChangeText={(text) => setContactInfo({...contactInfo, phone: text})}
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Email (optional)"
              value={contactInfo.email}
              onChangeText={(text) => setContactInfo({...contactInfo, email: text})}
              keyboardType="email-address"
            />

            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Message to owner (optional)"
              value={contactInfo.message}
              onChangeText={(text) => setContactInfo({...contactInfo, message: text})}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowContactModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitBooking}
              >
                <Text style={styles.submitButtonText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  dateSelection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 20,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dateButton: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedDate: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  monthText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  selectedDateText: {
    color: 'white',
  },
  bookingInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 12,
  },
  bookButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
