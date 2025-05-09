import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const TotalPatientsScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Sample patient data
  const patients = [
    { 
      id: 1, 
      name: 'Mominah Ejaz',
      age: 35,
      gender: 'Female',
      lastVisit: '2023-07-15',
      status: 'Recovered'
    },
    { 
      id: 2, 
      name: 'Esha Imran',
      age: 28,
      gender: 'Male',
      lastVisit: '2023-07-14',
      status: 'In Treatment'
    },
    // Add more patients...
  ];

  // Filtering system
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || patient.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Patient card component
  const PatientItem = ({ patient }) => (
    <TouchableOpacity style={styles.patientCard}>
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{patient.name}</Text>
        <View style={styles.detailRow}>
          <MaterialIcons name="person" size={16} color="#284b63" />
          <Text style={styles.detailText}>{patient.gender}, {patient.age} years</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="event" size={16} color="#284b63" />
          <Text style={styles.detailText}>Last visit: {patient.lastVisit}</Text>
        </View>
        <View style={[styles.statusBadge, {backgroundColor: getStatusColor(patient.status)}]}>
          <Text style={styles.statusText}>{patient.status}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.callButton}>
        <MaterialIcons name="call" size={24} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Status color coding
  const getStatusColor = (status) => {
    switch(status) {
      case 'Recovered': return '#c8e6c9';
      case 'In Treatment': return '#fff3e0';
      case 'Critical': return '#ffcdd2';
      default: return '#e0e0e0';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={28} color="#284b63" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Total Patients</Text>
        <TouchableOpacity>
          <MaterialIcons name="search" size={28} color="#284b63" />
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        <View style={styles.filterContainer}>
          {['all', 'Recovered', 'In Treatment', 'Critical'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.selectedFilter
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.selectedFilterText
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Patient List */}
      <FlatList
        data={filteredPatients}
        renderItem={({ item }) => <PatientItem patient={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No patients found</Text>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/NewPatient')}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#284b63',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#284b63',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#e8e8e8',
  },
  selectedFilter: {
    backgroundColor: '#284b63',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
  },
  selectedFilterText: {
    color: 'white',
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
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#284b63',
    marginBottom: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#284b63',
    fontWeight: '500',
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
    textAlign: 'center',
    color: '#999',
    marginTop: 30,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
});

export default TotalPatientsScreen;