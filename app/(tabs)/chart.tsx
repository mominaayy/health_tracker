import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const DoctorChartsScreen = () => {
  const [viewMode, setViewMode] = useState('weekly');
  const statusColors = {
    taken: '#10b981',
    missed: '#ef4444',
    late: '#f59e0b'
  };

  // Current Patient Details
  const currentPatient = {
    name: 'John Doe',
    condition: 'Hypertension',
    age: 45,
    gender: 'Male'
  };

  // Weekly Data
  const weeklyChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [3, 4, 2, 5, 3, 4, 2],
        color: statusColors.taken,
      },
      {
        data: [1, 2, 0, 1, 2, 1, 0],
        color: statusColors.missed,
      },
      {
        data: [2, 1, 1, 0, 1, 0, 2],
        color: statusColors.late,
      }
    ]
  };

  // Daily Data
  const dailyChartData = {
    labels: ['8 AM', '12 PM', '4 PM', '8 PM'],
    datasets: [
      {
        data: [3, 2, 1, 2],
        color: statusColors.taken,
      },
      {
        data: [0, 1, 0, 0],
        color: statusColors.missed,
      },
      {
        data: [1, 0, 1, 0],
        color: statusColors.late,
      }
    ]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(40, 75, 99, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(40, 75, 99, ${opacity})`,
    propsForLabels: {
      fontSize: 12,
      fontWeight: '500'
    },
    barPercentage: 0.6,
    barRadius: 4,
    fillShadowGradientOpacity: 0.3,
  };

  const renderLegend = () => (
    <View style={styles.legendContainer}>
      {Object.entries(statusColors).map(([status, color]) => (
        <View key={status} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: color }]} />
          <Text style={styles.legendText}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Patient Details Header */}
      <View style={styles.patientHeader}>
        <Text style={styles.patientName}>{currentPatient.name}</Text>
        <Text style={styles.patientDetails}>
          {currentPatient.age}yrs, {currentPatient.gender} | {currentPatient.condition}
        </Text>
      </View>

      {/* View Mode Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'weekly' && styles.activeToggle]}
          onPress={() => setViewMode('weekly')}
        >
          <Text style={[styles.toggleText, viewMode === 'weekly' && styles.activeToggleText]}>
            Weekly View
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'daily' && styles.activeToggle]}
          onPress={() => setViewMode('daily')}
        >
          <Text style={[styles.toggleText, viewMode === 'daily' && styles.activeToggleText]}>
            Daily View
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chart Container */}
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>
            {viewMode === 'weekly' ? 'Weekly Medication Record' : 'Daily Medication Schedule'}
          </Text>
          {renderLegend()}
        </View>
        
        <BarChart
          data={viewMode === 'weekly' ? weeklyChartData : dailyChartData}
          width={screenWidth - 40}
          height={300}
          chartConfig={chartConfig}
          verticalLabelRotation={-45}
          showBarTops={false}
          fromZero
          style={styles.chart}
          withCustomBarColorFromData
          flatColor
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  patientHeader: {
    marginBottom: 25,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  patientName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#284b63',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: '#64748b',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#284b63',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeToggleText: {
    color: '#fff',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#284b63',
    flex: 1,
  },
  chart: {
    borderRadius: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
});

export default DoctorChartsScreen;