import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore'; // Adjust path as needed
import { API_BASE_URL } from '../utils/constants';

const TodaysAppointmentsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore.getState().token;
  const doctorId = useAuthStore.getState().localId;


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/doctor/${doctorId}/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          const todayDate = new Date().toISOString().split("T")[0];

          const todayAppointments = data.appointments.filter(
            (apt) => apt.date === todayDate
          ).map((apt) => ({
            id: apt.id,
            name: apt.patient_name,
            time: formatTime(apt.time),
            status: apt.status,
          }));

          setAppointments(todayAppointments);
        } else {
          console.error(data.error || "Failed to fetch");
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatTime = (isoTime) => {
    const date = new Date(`1970-01-01T${isoTime}`);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = ((hours + 11) % 12 + 1); // convert 24h to 12h
    return `${adjustedHours}:${minutes} ${suffix}`;
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusDetails = (status) => {
    switch (status) {
      case 'Confirmed':
        return { color: '#284b63', icon: 'check-circle', bg: '#e3f2fd' };
      case 'Pending':
        return { color: '#f59e0b', icon: 'clock', bg: '#fffbeb' };
      case 'Completed':
        return { color: '#10b981', icon: 'check-circle', bg: '#ecfdf5' };
      case 'Cancelled':
        return { color: '#ef4444', icon: 'x-circle', bg: '#fef2f2' };
      default:
        return { color: '#6b7280', icon: 'info', bg: '#f3f4f6' };
    }
  };

  {loading ? (
    <ActivityIndicator size="large" color="#284b63" style={{ marginTop: 40 }} />
  ) : (
    filteredAppointments.map(appointment => {
      const statusDetails = getStatusDetails(appointment.status);
      
      return (
        <TouchableOpacity 
          key={appointment.id} 
          style={styles.card}
          activeOpacity={0.9}
        >
          <View style={styles.avatar}>
            <FontAwesome5 name="user-circle" size={32} color="#284b63" />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{appointment.name}</Text>
            <View style={styles.timeContainer}>
              <Feather name="clock" size={14} color="#6b7280" />
              <Text style={styles.time}>{appointment.time}</Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusDetails.bg }]}>
            <Feather 
              name={statusDetails.icon} 
              size={14} 
              color={statusDetails.color} 
              style={styles.statusIcon}
            />
            <Text style={[styles.statusText, { color: statusDetails.color }]}>
              {appointment.status}
            </Text>
          </View>
        </TouchableOpacity>
      );
    })
  )}

  return (
    <ScrollView style={styles.container}>
      {/* Enhanced Search Bar */}
      <View style={[styles.searchContainer, isFocused && styles.searchFocused]}>
        <Feather 
          name="search" 
          size={20} 
          color={isFocused ? '#284b63' : '#64748b'} 
          style={styles.searchIcon} 
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="words"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor="#284b63"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Feather name="x" size={18} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Today's Appointments</Text>
          <Text style={styles.subtitle}>Friday, 15 April 2025</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialIcons name="event" size={28} color="#fff" />
        </View>
      </View>

      {/* Appointments List */}
      {filteredAppointments.map(appointment => {
        const statusDetails = getStatusDetails(appointment.status);
        
        return (
          <TouchableOpacity 
            key={appointment.id} 
            style={styles.card}
            activeOpacity={0.9}
          >
            <View style={styles.avatar}>
              <FontAwesome5 name="user-circle" size={32} color="#284b63" />
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{appointment.name}</Text>
              <View style={styles.timeContainer}>
                <Feather name="clock" size={14} color="#6b7280" />
                <Text style={styles.time}>{appointment.time}</Text>
              </View>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: statusDetails.bg }]}>
              <Feather 
                name={statusDetails.icon} 
                size={14} 
                color={statusDetails.color} 
                style={styles.statusIcon}
              />
              <Text style={[styles.statusText, { color: statusDetails.color }]}>
                {appointment.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      )}

      {/* Empty State */}
      {filteredAppointments.length === 0 && (
        <View style={styles.emptyState}>
          <MaterialIcons name="event-available" size={48} color="#cbd5e1" />
          <Text style={styles.emptyText}>
            {searchQuery ? 
              'No patients found matching your search' : 
              'No appointments scheduled for today'
            }
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginVertical: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  searchFocused: {
    borderColor: '#284b63',
    shadowOpacity: 0.1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#1e293b',
    paddingVertical: 0,
    letterSpacing: 0.25,
    paddingRight: 30, // Space for clear button
  },
  clearButton: {
    position: 'absolute',
    right: 18,
    padding: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#284b63',
    borderRadius: 16,
    padding: 20,
    marginVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flex: 1,
  },
  headerIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 8,
    marginLeft: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'Helvetica',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 12,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default TodaysAppointmentsScreen;