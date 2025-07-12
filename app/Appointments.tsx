import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../utils/constants';

/**
 * This screen renders either **today's appointments** or **all appointments**
 * based on the `scope` parameter passed via navigation.
 *   - scope="today"  → only appointments scheduled for today
 *   - scope="all"    → all appointments returned by the API (default)
 *
 * The UI / styling remains exactly the same as before.
 */
const TodaysAppointmentsScreen = () => {
  const { scope = 'today' } = useLocalSearchParams(); // "today" | "all"
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = useAuthStore.getState().token;
  const doctorId = useAuthStore.getState().localId;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/doctor/${doctorId}/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || 'Failed to fetch');

        const todayStr = new Date().toISOString().split('T')[0];

        const mapped = data.appointments.map((apt) => ({
          id: apt.id,
          name: apt.patient_name,
          time: formatTime(apt.time),
          status: apt.status,
          rawDate: apt.date,
        }));

        const finalList = scope === 'today'
          ? mapped.filter((apt) => apt.rawDate === todayStr)
          : mapped;

        setAppointments(finalList);
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [scope]);

  const formatTime = (isoTime) => {
    const d = new Date(`1970-01-01T${isoTime}`);
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hr12 = ((h + 11) % 12) + 1;
    return `${hr12}:${m} ${suffix}`;
  };

  const filtered = appointments.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  /** ---------- RENDER ---------- */
  const renderCard = (apt) => {
    const s = getStatusDetails(apt.status);
    return (
      <TouchableOpacity key={apt.id} style={styles.card} activeOpacity={0.9} 
      onPress={() =>
      router.push({
        pathname: '/create-medication',   // medication‑creation screen
        params:  { patientId: apt.id },
      })
    }>
        <View style={styles.avatar}>
          <FontAwesome5 name="user-circle" size={32} color="#284b63" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{apt.name}</Text>
          <View style={styles.timeContainer}>
            <Feather name="clock" size={14} color="#6b7280" />
            <Text style={styles.time}>{apt.time}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
          <Feather name={s.icon} size={14} color={s.color} style={styles.statusIcon} />
          <Text style={[styles.statusText, { color: s.color }]}>{apt.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const todayHeading = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <ScrollView style={styles.container}>
      {/* Search */}
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Feather name="x" size={18} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{scope === 'today' ? "Today's Appointments" : 'All Appointments'}</Text>
          {scope === 'today' ? <Text style={styles.subtitle}>{todayHeading}</Text> : ''}
        </View>
        <View style={styles.headerIcon}>
          <MaterialIcons name="event" size={28} color="#fff" />
        </View>
      </View>

      {/* Loader / List */}
      {loading ? (
        <ActivityIndicator size="large" color="#284b63" style={{ marginTop: 40 }} />
      ) : filtered.length > 0 ? (
        filtered.map(renderCard)
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="event-available" size={48} color="#cbd5e1" />
          <Text style={styles.emptyText}>No appointments found</Text>
        </View>
      )}
    </ScrollView>
  );
};

// ------ styles unchanged ------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 16 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 14, marginVertical: 16, borderWidth: 1.5, borderColor: '#e2e8f0',
    shadowColor: '#0f172a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  searchFocused: { borderColor: '#284b63', shadowOpacity: 0.1 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 17, color: '#1e293b', paddingVertical: 0, letterSpacing: 0.25 },
  clearButton: { position: 'absolute', right: 18, padding: 4, backgroundColor: '#f1f5f9', borderRadius: 10 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#284b63',
    borderRadius: 16, padding: 20, marginVertical: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  headerContent: { flex: 1 },
  headerIcon: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 8, marginLeft: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4, letterSpacing: 0.5 },
  subtitle: { fontSize: 14, color: '#e2e8f0', fontWeight: '500' },
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  avatar: { marginRight: 16 },
  infoContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  timeContainer: { flexDirection: 'row', alignItems: 'center' },
  time: { fontSize: 13, color: '#64748b', marginLeft: 6 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, marginLeft: 12 },
  statusIcon: { marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, color: '#94a3b8', marginTop: 16, fontWeight: '500', textAlign: 'center' },
});

export default TodaysAppointmentsScreen;
