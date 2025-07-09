import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator, Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../utils/constants';

const TotalPatientsScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = useAuthStore.getState().token;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/patient/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await response.json();

        if (response.ok && json.patients) {
          setPatients(json.patients);
        } else {
          Alert.alert('Error', json?.error || 'Failed to load patients');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong while fetching patients.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Recovered': return '#c8e6c9';
      case 'In Treatment': return '#fff3e0';
      case 'Critical': return '#ffcdd2';
      default: return '#e0e0e0';
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const PatientItem = ({ patient }) => (
    <TouchableOpacity style={styles.patientCard}>
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{patient.full_name}</Text>
        <View style={styles.detailRow}>
          <MaterialIcons name="person" size={16} color="#284b63" />
          <Text style={styles.detailText}>{patient.gender || 'N/A'}, {patient.age || 'N/A'} years</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="event" size={16} color="#284b63" />
          <Text style={styles.detailText}>Medical: {patient.medical_condition || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="phone" size={16} color="#284b63" />
          <Text style={styles.detailText}>{patient.phone_number || 'N/A'}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.callButton}>
        <MaterialIcons name="call" size={24} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={28} color="#284b63" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Total Patients</Text>
        <TouchableOpacity>
          <MaterialIcons name="search" size={28} color="#284b63" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#284b63" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={filteredPatients}
          renderItem={({ item }) => <PatientItem patient={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No patients found</Text>}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/NewPatient')}>
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 16 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  screenTitle: {
    fontSize: 24, fontWeight: 'bold', color: '#284b63',
  },
  searchContainer: { marginBottom: 20 },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#284b63',
  },
  patientCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#284b63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  patientInfo: { flex: 1 },
  patientName: {
    fontSize: 18, fontWeight: '600', color: '#284b63', marginBottom: 5,
  },
  detailRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 3,
  },
  detailText: {
    fontSize: 14, color: '#666', marginLeft: 5,
  },
  callButton: {
    backgroundColor: '#284b63',
    padding: 10,
    borderRadius: 12,
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#284b63',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  emptyText: {
    textAlign: 'center', color: '#999', marginTop: 30, fontSize: 16,
  },
  listContent: { paddingBottom: 80 },
});

export default TotalPatientsScreen;
