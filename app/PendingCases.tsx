import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PendingCasesScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [cases] = useState([
    {
      id: 1,
      patient: 'Mominah Ejaz',
      age: 35,
      priority: 'high',
      daysPending: 2,
      caseSummary: 'Persistent fever & respiratory distress',
      lastUpdate: 'Lab results pending',
      urgencyMeter: 85
    },
    {
      id: 2,
      patient: 'Esha Imran',
      age: 28,
      priority: 'medium',
      daysPending: 1,
      caseSummary: 'Post-operative recovery monitoring',
      lastUpdate: 'Vitals stable',
      urgencyMeter: 45
    },
    // Add more cases...
  ]);

  // Animated progress bars
  const AnimatedProgress = ({ percentage }) => {
    const widthAnim = new Animated.Value(0);
    
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 1000,
      useNativeDriver: false
    }).start();

    return (
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, {
          width: widthAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%']
          })
        }]} />
      </View>
    );
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.patient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || c.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const CaseCard = ({ caseData }) => (
    <TouchableOpacity style={[styles.caseCard, styles[caseData.priority]]}>
      <View style={styles.cardHeader}>
        <Text style={styles.patientName}>{caseData.patient}</Text>
        <View style={styles.priorityPill}>
          <Text style={styles.priorityText}>{caseData.priority.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.detailRow}>
        <MaterialIcons name="timeline" size={16} color="#284b63" />
        <Text style={styles.detailText}>Pending for {caseData.daysPending} days</Text>
      </View>

      <Text style={styles.caseSummary}>{caseData.caseSummary}</Text>
      
      <View style={styles.progressRow}>
        <Text style={styles.urgencyText}>Urgency Level:</Text>
        <AnimatedProgress percentage={caseData.urgencyMeter} />
      </View>

      <View style={styles.updateRow}>
        <MaterialIcons name="info" size={16} color="#284b63" />
        <Text style={styles.lastUpdate}>{caseData.lastUpdate}</Text>
      </View>

      <View style={styles.actionRow}>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => router.push(`/chat`)}
      >
        <MaterialIcons name="message" size={20} color="#284b63" />
        <Text style={styles.actionText}>Message</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => router.push(`/notes`)}
      >
        <MaterialIcons name="assignment" size={20} color="#284b63" />
        <Text style={styles.actionText}>Notes</Text>
      </TouchableOpacity>
        <TouchableOpacity style={styles.resolveButton}>
          <MaterialIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.resolveText}>Mark Resolved</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with Emergency Indicator */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={28} color="#284b63" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.screenTitle}>Pending Cases</Text>
          <Text style={styles.emergencyIndicator}>🚨 {cases.length} Urgent Cases</Text>
        </View>
        <MaterialIcons name="warning" size={28} color="#ff4444" />
      </View>

      {/* Smart Filter & Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search cases..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.priorityFilter}>
          {['all', 'high', 'medium', 'low'].map(priority => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.priorityButton,
                selectedPriority === priority && styles.selectedPriority,
                styles[`${priority}Priority`]
              ]}
              onPress={() => setSelectedPriority(priority)}
            >
              <Text style={[
                styles.priorityButtonText,
                selectedPriority === priority && styles.selectedPriorityText
              ]}>
                {priority === 'all' ? 'All' : priority.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Cases List */}
      <FlatList
        data={filteredCases}
        renderItem={({ item }) => <CaseCard caseData={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="check-circle-outline" size={48} color="#284b63" />
            <Text style={styles.emptyText}>All clear! No pending cases</Text>
          </View>
        }
      />

      {/* Quick Action Fab */}
      <TouchableOpacity 
        style={styles.quickActionFab}
        onPress={() => router.push('/NewPatient')}
      >
        <MaterialIcons name="add-alarm" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#284b63',
  },
  emergencyIndicator: {
    color: '#ff4444',
    fontWeight: '500',
    marginTop: 4,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#284b63',
    marginBottom: 12,
    elevation: 2,
  },
  priorityFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#e9ecef',
  },
  selectedPriority: {
    borderWidth: 2,
    borderColor: '#284b63',
  },
  highPriority: {
    backgroundColor: '#ffebee',
  },
  mediumPriority: {
    backgroundColor: '#fff3e0',
  },
  lowPriority: {
    backgroundColor: '#e8f5e9',
  },
  priorityButtonText: {
    color: '#495057',
    fontWeight: '500',
  },
  selectedPriorityText: {
    color: '#284b63',
    fontWeight: 'bold',
  },
  caseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  high: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  medium: {
    borderLeftWidth: 4,
    borderLeftColor: '#ffa726',
  },
  low: {
    borderLeftWidth: 4,
    borderLeftColor: '#66bb6a',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#284b63',
  },
  priorityPill: {
    backgroundColor: 'rgba(40, 75, 99, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityText: {
    color: '#284b63',
    fontWeight: '500',
    fontSize: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    color: '#6c757d',
    marginLeft: 8,
  },
  caseSummary: {
    color: '#495057',
    fontWeight: '500',
    marginVertical: 12,
  },
  progressRow: {
    marginVertical: 10,
  },
  urgencyText: {
    color: '#284b63',
    marginBottom: 6,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#284b63',
    borderRadius: 4,
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  lastUpdate: {
    color: '#6c757d',
    fontSize: 12,
    marginLeft: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(40, 75, 99, 0.05)',
  },
  actionText: {
    color: '#284b63',
    marginLeft: 4,
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#66bb6a',
  },
  resolveText: {
    color: '#fff',
    marginLeft: 4,
  },
  quickActionFab: {
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#6c757d',
    marginTop: 16,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
});

export default PendingCasesScreen;