import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

const DoctorProfileScreen = () => {
  // Mock data
  const doctor = {
    name: 'Dr. Sarah',
    specialty: 'Cardiologist',
    rating: 4.8,
    experience: '15 years',
    language: 'English, Spanish',
    bio: 'Board-certified cardiologist with extensive experience in non-invasive cardiology and preventive care. Special interest in heart disease prevention.',
    workingHours: [
      { day: 'Mon', hours: '9:00 AM - 5:00 PM' },
      { day: 'Tue', hours: '9:00 AM - 5:00 PM' },
      { day: 'Wed', hours: '10:00 AM - 7:00 PM' },
      { day: 'Thu', hours: '9:00 AM - 5:00 PM' },
      { day: 'Fri', hours: '9:00 AM - 3:00 PM' },
    ],
    reviews: [
      { id: 1, user: 'John D.', rating: 5, comment: 'Excellent doctor! Very professional and caring.', date: '2023-03-15' },
      { id: 2, user: 'Maria S.', rating: 4, comment: 'Good experience, but waiting time was a bit long.', date: '2023-03-14' },
    ],
  };

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

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <RatingStars rating={doctor.rating} />
        </View>
      </View>

      {/* Contact Section */}
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

      {/* Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Doctor</Text>
        <Text style={styles.bioText}>{doctor.bio}</Text>
      </View>

      {/* Working Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Working Hours</Text>
        {doctor.workingHours.map((day, index) => (
          <View key={index} style={styles.hoursRow}>
            <Text style={styles.dayText}>{day.day}</Text>
            <Text style={styles.hoursText}>{day.hours}</Text>
          </View>
        ))}
      </View>

      {/* Reviews */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Reviews ({doctor.reviews.length})</Text>
        {doctor.reviews.map(review => (
          <View key={review.id} style={styles.reviewContainer}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewUser}>{review.user}</Text>
              <RatingStars rating={review.rating} />
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#284b63', 
  },
  specialty: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    color: '#666',
  },
  contactSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
  },
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
  secondaryButton: {
    backgroundColor: '#3c6d8a', 
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#284b63', 
  },

  bioText: {
    lineHeight: 24,
    color: '#666',
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  hoursText: {
    fontSize: 16,
    color: '#666',
  },
  reviewContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  reviewUser: {
    fontWeight: 'bold',
  },
  reviewDate: {
    color: '#666',
    fontSize: 12,
  },
  reviewComment: {
    color: '#666',
    lineHeight: 20,
  },
});

export default DoctorProfileScreen;
