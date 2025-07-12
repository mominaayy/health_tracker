import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore'; // Adjust path as needed
import { API_BASE_URL } from '../../utils/constants';

import DoctorProfileScreen from './profile'; 

const DoctorHomeScreen = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore.getState().token;
  const doctorId = useAuthStore.getState().localId;
  const limit = 5;

  useEffect(() => {
    const fetchRecentPatients = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/doctor/${doctorId}/recent-patients?limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          const formatted = data.recent_patients.map((p) => ({
            id: p.id,
            name: p.name,
            lastVisit: formatRelativeTime(p.last_appointment.date), // optional: relative formatting
            status: p.last_appointment.status,
          }));
          setRecentPatients(formatted);
        } else {
          console.error(data.error || 'Failed to fetch');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPatients();
  }, []);

  const formatRelativeTime = (isoDate) => {
    const diff = Math.floor((Date.now() - new Date(isoDate)) / (1000 * 60 * 60 * 24));
    return diff === 0 ? 'Today' : `${diff}d ago`;
  };


  const handleActionPress = (screen: string) => {
    router.push(`/${screen}`);
  };

  const handleMenuPress = (destination: string) => {
    setMenuVisible(false);
    if (destination === 'logout') {
      router.replace('/login');
    } else {
      router.push(`/${destination}`);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.doctorName}>Dr. Ali</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={styles.notificationButton}>
              <MaterialIcons name="notifications" size={24} color="#284b63" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationButton} onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu" size={24} color="#284b63" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Container with Navigation */}
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => router.push('/TotalPatients')}
          >
            <MaterialIcons name="people" size={24} color="#284b63" />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statTitle}>Total Patients</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard}
            onPress={() =>
              router.push({
                      pathname: '/Appointments',
                      params: {
                        scope: "today"
                      },
                    })
            }
          >
            <MaterialIcons name="event" size={24} color="#284b63" />
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statTitle}>Today's Appointments</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => router.push('/PendingCases')}
          >
            <MaterialIcons name="warning" size={24} color="#284b63" />
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statTitle}>Pending Cases</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <ActionButton icon="add" label="New Patient" onPress={() => handleActionPress('NewPatient')} />
          <ActionButton icon="list" label="Appointments" onPress={() => router.push({
                      pathname: '/Appointments',
                      params: {
                        scope: "all"
                      },
                    })} />
          <ActionButton icon="assignment" label="Reports" onPress={() => handleActionPress('Reports')} />
          <ActionButton icon="chat" label="Messages" onPress={() => router.replace('/(tabs)/chat')} />
        </View>

        {/* Recent Patients */}
        <Text style={styles.sectionTitle}>Recent Patients</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} router={router}/>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Modal Menu */}
      <Modal visible={menuVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Menu</Text>
            <MenuItem icon="person" label="Profile" onPress={() => handleMenuPress('(tabs)/profile')} />
            <MenuItem icon="person-add" label="Signup" onPress={() => handleMenuPress('signup')} />
            <MenuItem icon="logout" label="Logout" onPress={() => handleMenuPress('login')} />
            <MenuItem icon="settings" label="Settings" onPress={() => handleMenuPress('settings')} />
            <MenuItem icon="help-outline" label="Help & Support" onPress={() => handleMenuPress('support')} />
            <MenuItem icon="info" label="About App" onPress={() => handleMenuPress('about')} />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// Reusable Components
const ActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <View style={styles.actionIcon}>
      <MaterialIcons name={icon} size={24} color="white" />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const PatientCard = ({ patient , router}) => (
  <TouchableOpacity onPress={() =>
      router.push({
        pathname: '/create-medication',   // medication‑creation screen
        params:  { patientId: patient.id },
      })
    }>
  <View style={styles.patientCard}>
    <Text style={styles.patientName}>{patient.name}</Text>
    <Text style={styles.patientDetail}>Last Visit: {patient.lastVisit}</Text>
    <View style={styles.statusBadge}>
      <Text style={styles.statusText}>{patient.status}</Text>
    </View>
  </View>
  </TouchableOpacity>
);

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <MaterialIcons name={icon} size={24} color="#284b63" />
    <Text style={styles.menuItemText}>{label}</Text>
  </TouchableOpacity>
);


// Styles
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
    marginBottom: 24,
  },
  greeting: {
    fontSize: 18,
    color: '#284b63',
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#284b63',
  },
  notificationButton: {
    padding: 10,
    backgroundColor: 'rgba(40, 75, 99, 0.1)',
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#284b63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#284b63',
    marginVertical: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#284b63',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#284b63',
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionIcon: {
    backgroundColor: '#284b63',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionLabel: {
    color: '#284b63',
    fontSize: 14,
    textAlign: 'center',
  },
  patientCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 200,
    shadowColor: '#284b63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#284b63',
    marginBottom: 8,
  },
  patientDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: 'rgba(40, 75, 99, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#284b63',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#284b63',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    color: '#284b63',
    marginLeft: 12,
  },
});

export default DoctorHomeScreen;
