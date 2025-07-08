import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';

const DoctorProfileScreen = () => {
  const uid = useAuthStore.getState().uid;
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/doctor/profile/${uid}`);
        const data = await response.json();

        if (!response.ok) {
          Alert.alert('Error', data?.error || 'Failed to fetch profile');
        } else {
          setDoctor(data);
        }
      } catch (error) {
        Alert.alert('Error', 'Network error');
      }
    };

    if (uid) fetchProfile();
  }, [uid]);

  const RatingStars = ({ rating }) => (
    <View style={styles.ratingContainer}>
      {[...Array(5)].map((_, index) => (
        <MaterialCommunityIcons
          key={index}
          name={index < rating ? 'star' : 'star-outline'}
          size={20}
          color="#FFD700"
        />
      ))}
      <Text style={styles.ratingText}>({rating})</Text>
    </View>
  );

  const formatWorkingHours = (workingHours) => {
    if (!workingHours) return [];
    const formatted = [];
    const days = [
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    ];
    const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    days.forEach((day, idx) => {
      const dayData = workingHours[day];
      const hours = dayData?.start && dayData?.end ? `${dayData.start} - ${dayData.end}` : 'Not Available';
      formatted.push({ day: shortDays[idx], hours });
    });
    return formatted;
  };

  if (!doctor) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading profile...</Text>
      </View>
    );
  }

  const workingHoursFormatted = formatWorkingHours(doctor.working_hours);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{doctor.full_name || 'N/A'}</Text>
          <Text style={styles.specialty}>{doctor.specialization || 'Specialization not provided'}</Text>
          <RatingStars rating={4} />
        </View>
      </View>

      <View style={styles.contactSection}>
        <TouchableOpacity style={styles.contactButton}>
          <FontAwesome name="phone" size={20} color="white" />
          <Text style={styles.buttonText}>Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.contactButton, { backgroundColor: '#4CAF50' }]}>
          <Ionicons name="location-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Directions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Doctor</Text>
        <Text style={styles.bioText}>{doctor.about || 'No bio provided.'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Working Hours</Text>
        {workingHoursFormatted.map((item, index) => (
          <View key={index} style={styles.hoursRow}>
            <Text style={styles.dayText}>{item.day}</Text>
            <Text style={styles.hoursText}>{item.hours}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerInfo: { alignItems: 'center' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, color: '#284b63' },
  specialty: { fontSize: 16, color: '#666', marginBottom: 8 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginLeft: 8, color: '#666' },
  contactSection: { flexDirection: 'row', marginHorizontal: 20, marginVertical: 10 },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#284b63',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: { color: 'white', marginLeft: 10, fontWeight: 'bold' },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#284b63' },
  bioText: { lineHeight: 24, color: '#666' },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  dayText: { fontSize: 16, color: '#333' },
  hoursText: { fontSize: 16, color: '#666' },
});

export default DoctorProfileScreen;