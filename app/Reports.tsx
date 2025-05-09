import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Report = () => {
  const router = useRouter();

  const patientReport = {
    name: 'Mominah',
    age: "21",
    gender: 'Female',
    diagnosis: 'Type 2 Diabetes',
    lastVisit: 'April 15, 2025',
    medications: ['Metformin (500mg)', 'Insulin Glargine', 'Vitamin D3 (2000IU)'],
    notes: 'Good progress maintaining blood sugar levels. Continue current regimen. Recommend:\n- Monthly A1C checks\n- Daily foot care routine\n- Follow-up in 4 weeks'
  };

  const Section = ({ icon, label, value, isList, children }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name={icon} size={22} color="#284b63" />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.sectionContent}>
        {isList ? (
          value.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
        {children}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Health Summary</Text>
        <Text style={styles.subheading}>Prepared for Mominah</Text>
      </View>

      <View style={styles.card}>
        <Section
          icon="account-details"
          label="Personal Information"
          value={null}
          isList={false}
        >
          <InfoRow icon="calendar" title="Age" value={patientReport.age} />
          <InfoRow icon="gender-male-female" title="Gender" value={patientReport.gender} />
          <InfoRow icon="calendar-clock" title="Last Visit" value={patientReport.lastVisit} />
        </Section>
      </View>

      <View style={styles.card}>
        <Section
          icon="heart-pulse"
          label="Health Status"
          value={patientReport.diagnosis}
          isList={false}
        />
        
        <Section
          icon="pill"
          label="Current Medications"
          value={patientReport.medications}
          isList={true}
        />
      </View>

      <View style={styles.card}>
        <Section
          icon="text-box-check"
          label="Care Team Notes"
          value={patientReport.notes}
          isList={false}
        />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.back()}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>Return to Home</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoRow = ({ icon, title, value }) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons name={icon} size={18} color="#3c5d75" />
    <Text style={styles.infoTitle}>{title}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700', 
    color: '#284b63',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-light',
  },
  subheading: {
    fontSize: 16,
    color: '#3c5d75',
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7f1',
    paddingBottom: 12,
  },
  label: {
    fontWeight: '500',
    fontSize: 18,
    color: '#284b63',
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  sectionContent: {
    paddingHorizontal: 8,
  },
  value: {
    fontSize: 16,
    color: '#4a6670',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    color: '#3c5d75',
    marginRight: 8,
    fontSize: 16,
  },
  listText: {
    fontSize: 16,
    color: '#4a6670',
    flex: 1,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
  },
  infoTitle: {
    fontSize: 15,
    color: '#5a7c86',
    marginLeft: 8,
    marginRight: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#4a6670',
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#284b63',
    paddingVertical: 16,
    borderRadius: 12,
    margin: 20,
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#1a3442',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '500',
    marginRight: 10,
    letterSpacing: 0.4,
  },
});

export default Report;