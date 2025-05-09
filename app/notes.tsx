import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotesScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState('');
  const [lastSaved, setLastSaved] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved');
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const savedNote = await AsyncStorage.getItem(`caseNote_${id}`);
        if (savedNote) setNote(savedNote);
      } catch (error) {
        console.error('Error loading note:', error);
      }
    };
    
    loadNote();
  }, [id]);

  const triggerSaveAnimation = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  };

  const saveNote = async () => {
    try {
      triggerSaveAnimation();
      await AsyncStorage.setItem(`caseNote_${id}`, note);
      setLastSaved(new Date().toLocaleTimeString());
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      setSaveStatus('Error Saving');
    }
  };

  // Auto-save after 2 seconds of inactivity
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (note) saveNote();
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [note]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#284b63" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Patient Notes</Text>
          <Text style={styles.caseNumber}>Case ID: #{id}</Text>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity 
            onPress={saveNote}
            style={styles.saveButton}
          >
            <MaterialIcons name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>SAVE</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Note Editor */}
      <TextInput
        style={styles.noteInput}
        multiline
        placeholder="Start typing your clinical notes..."
        placeholderTextColor="#95a5a6"
        value={note}
        onChangeText={setNote}
        textAlignVertical="top"
        autoFocus
        scrollEnabled
        keyboardAppearance="light"
      />

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {saveStatus} • {lastSaved && `Last saved: ${lastSaved}`}
        </Text>
        <Text style={styles.statusText}>
          {note.length} characters • {note.split(/\s+/).filter(Boolean).length} words
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    backgroundColor: '#fff',
    shadowColor: '#284b63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(40, 75, 99, 0.05)',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#284b63',
    textAlign: 'center',
  },
  caseNumber: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#284b63',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50',
    padding: 20,
    paddingTop: 24,
    backgroundColor: '#fff',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingHorizontal: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
});

export default NotesScreen;