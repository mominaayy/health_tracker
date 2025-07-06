import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { API_BASE_URL } from "../utils/constants";
import { useAuthStore } from '../store/authStore'; 


const NewPatient = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    condition: '',
  });

  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // Normalize gender to match enum values
  const normalizeGender = (value: string) => {
    const lower = value.trim().toLowerCase();
    if (lower === 'male') return 'MALE';
    if (lower === 'female') return 'FEMALE';
    return 'OTHER';
  };

  const handleSubmit = async () => {
    if (!Object.values(form).every(field => field.trim())) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const token = useAuthStore.getState().token;

    try {
      const response = await fetch(`${API_BASE_URL}/patient/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: form.name,
          age: form.age,
          gender: normalizeGender(form.gender),
          phone_number: form.phone,
          medical_condition: form.condition
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', result.message, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Network Error', 'Could not connect to server');
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>New Patient Registration</Text>
        <Text style={styles.subtitle}>Please fill all required fields</Text>
      </View>

      <View style={styles.formCard}>
        {/* Name Field */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="person-outline" size={20} color="#6b8a9e" />
          <TextInput
            style={[styles.input, focusedField === 'name' && styles.focusedInput]}
            placeholder="Full Name"
            placeholderTextColor="#95a6b5"
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {/* Age Field */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="event" size={20} color="#6b8a9e" />
          <TextInput
            style={[styles.input, focusedField === 'age' && styles.focusedInput]}
            placeholder="Age"
            placeholderTextColor="#95a6b5"
            keyboardType="number-pad"
            value={form.age}
            onChangeText={(text) => handleChange('age', text)}
            onFocus={() => setFocusedField('age')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {/* Gender Field */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="wc" size={20} color="#6b8a9e" />
          <TextInput
            style={[styles.input, focusedField === 'gender' && styles.focusedInput]}
            placeholder="Gender"
            placeholderTextColor="#95a6b5"
            value={form.gender}
            onChangeText={(text) => handleChange('gender', text)}
            onFocus={() => setFocusedField('gender')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {/* Phone Field */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="phone" size={20} color="#6b8a9e" />
          <TextInput
            style={[styles.input, focusedField === 'phone' && styles.focusedInput]}
            placeholder="Phone Number"
            placeholderTextColor="#95a6b5"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(text) => handleChange('phone', text)}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {/* Condition Field */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="healing" size={20} color="#6b8a9e" />
          <TextInput
            style={[styles.input, focusedField === 'condition' && styles.focusedInput]}
            placeholder="Medical Condition"
            placeholderTextColor="#95a6b5"
            multiline
            value={form.condition}
            onChangeText={(text) => handleChange('condition', text)}
            onFocus={() => setFocusedField('condition')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSubmit}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>Complete Registration</Text>
        <MaterialIcons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f5f9fc',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#284b63',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b8a9e',
    letterSpacing: 0.2,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#284b63',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7f1',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#284b63',
    marginLeft: 12,
    paddingVertical: 8,
    paddingRight: 10,
  },
  focusedInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#284b63',
    padding: 18,
    borderRadius: 14,
    marginTop: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#1a3442',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 10,
    letterSpacing: 0.3,
  },
});

export default NewPatient;