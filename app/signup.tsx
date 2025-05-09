import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const DoctorSignupScreen = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    specialty: 'General Physician',
    licenseNumber: '',
    experience: '',
    phone: '',
    clinicAddress: '',
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const specialties = [
    'Cardiologist',
    'Dermatologist',
    'General Physician',
    'Pediatrician',
    'Orthopedic Surgeon',
    'Neurologist',
    'Gynecologist',
    'Psychiatrist'
  ];

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    } else if (!/^[A-Za-z0-9-]{6,12}$/.test(formData.licenseNumber)) {
      newErrors.licenseNumber = 'Invalid license number format';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    } else if (!/^\d+$/.test(formData.experience)) {
      newErrors.experience = 'Please enter valid years';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.clinicAddress.trim()) {
      newErrors.clinicAddress = 'Clinic address is required';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form data:', {
        ...formData,
        experience: parseInt(formData.experience)
      });
      // Navigate or trigger backend signup logic here
    }
  };

  const InputField = ({
    icon,
    placeholder,
    value,
    onChangeText,
    error,
    rightIcon,
    ...props
  }) => (
    <View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color="#284b63"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
        {rightIcon && rightIcon}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Doctor Registration</Text>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <InputField
            icon="account-outline"
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={text => setFormData({ ...formData, fullName: text })}
            error={errors.fullName}
          />

          <InputField
            icon="email-outline"
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={text => setFormData({ ...formData, email: text })}
            error={errors.email}
          />

          <InputField
            icon="lock-outline"
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={text => setFormData({ ...formData, password: text })}
            error={errors.password}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            }
          />
        </View>

        {/* Professional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Information</Text>

          <View style={styles.pickerContainer}>
            <MaterialCommunityIcons
              name="stethoscope"
              size={20}
              color="#284b63"
              style={styles.icon}
            />
            <Picker
              selectedValue={formData.specialty}
              style={styles.picker}
              dropdownIconColor="#284b63"
              onValueChange={itemValue => setFormData({ ...formData, specialty: itemValue })}
            >
              {specialties.map((spec, index) => (
                <Picker.Item key={index} label={spec} value={spec} />
              ))}
            </Picker>
          </View>

          <InputField
            icon="certificate-outline"
            placeholder="Medical License Number"
            value={formData.licenseNumber}
            onChangeText={text => setFormData({ ...formData, licenseNumber: text })}
            error={errors.licenseNumber}
          />

          <InputField
            icon="calendar-blank"
            placeholder="Years of Experience"
            keyboardType="numeric"
            value={formData.experience}
            onChangeText={text => setFormData({ ...formData, experience: text })}
            error={errors.experience}
          />
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <InputField
            icon="phone-outline"
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={text => setFormData({ ...formData, phone: text })}
            error={errors.phone}
          />

          <InputField
            icon="map-marker-outline"
            placeholder="Clinic Address"
            multiline
            numberOfLines={3}
            value={formData.clinicAddress}
            onChangeText={text => setFormData({ ...formData, clinicAddress: text })}
            error={errors.clinicAddress}
          />
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Switch
            value={formData.acceptTerms}
            onValueChange={value => setFormData({ ...formData, acceptTerms: value })}
            thumbColor={formData.acceptTerms ? '#284b63' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#284b63' }}
          />
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
        {errors.acceptTerms && <Text style={styles.errorText}>{errors.acceptTerms}</Text>}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Already have an account */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#284b63',
    marginBottom: 25,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#284b63',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 15,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  termsText: {
    marginLeft: 10,
    color: '#666',
    flex: 1,
    fontSize: 14,
  },
  link: {
    color: '#284b63',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#284b63',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
});

export default DoctorSignupScreen;

