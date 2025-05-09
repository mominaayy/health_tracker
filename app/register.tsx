import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DoctorSignUpScreen = () => {
  const navigation = useNavigation();

  const [doctor, setDoctor] = useState({
    name:'',
    email:'',
    password:'',
    specialty:'',
    experience:'',
    language:'',
    bio:''
  });

  const handleInputChange = (field, value) => {
    setDoctor(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = () => {
    if (
      doctor.name && doctor.email && doctor.password &&
      doctor.specialty && doctor.experience && doctor.language && doctor.bio
    ) {
      // Navigate to profile with doctor data
      navigation.navigate('DoctorProfileScreen', { doctor });
    } else {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Doctor Sign Up</Text>

      {[
        { label: 'Full Name', field: 'name' },
        { label: 'Email', field: 'email' },
        { label: 'Password', field: 'password', secure: true },
        { label: 'Specialty', field: 'specialty' },
        { label: 'Experience (e.g., 10 years)', field: 'experience' },
        { label: 'Languages Spoken', field: 'language' },
        { label: 'Bio', field: 'bio', multiline: true },
      ].map(({ label, field, secure, multiline }) => (
        <TextInput
          key={field}
          style={[styles.input, multiline && { height: 100 }]}
          placeholder={label}
          secureTextEntry={secure}
          multiline={multiline}
          value={doctor[field]}
          onChangeText={(text) => handleInputChange(field, text)}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DoctorSignUpScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#284b63',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#284b63',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
