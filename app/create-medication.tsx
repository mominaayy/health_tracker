import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../utils/constants";
import { useAuthStore } from "../store/authStore";

/**
 * Screen shown in DOCTOR app to create a medication course for a given patient.
 * Expects a route param `patientId` so you can navigate like:
 *   router.push({ pathname: "/CreateMedication", params: { patientId } });
 */
export function CreateMedicationScreen() {
  const router = useRouter();
  const { patientId } = useLocalSearchParams(); // ← passed from RecentPatients / Appointments

  // doctor_id & token come from global auth‑store (already used elsewhere)
  const doctorId = useAuthStore.getState().localId;
  const token     = useAuthStore.getState().token;

  // ------- form state -------
  const [drugName, setDrugName]         = useState("");
  const [dosesPerDay, setDosesPerDay]   = useState("1"); // string for TextInput
  const [gapHours, setGapHours]         = useState("12");
  const [durationDays, setDuration]     = useState("7");
  const [notes, setNotes]               = useState("");

  const handleCreate = async () => {
    if (!drugName || !dosesPerDay || !gapHours || !durationDays) {
      Alert.alert("All fields except notes are required" , "error");
      return;
    }

    const payload = {
      patient_id: Number(patientId),
      doctor_id:  Number(doctorId),
      drug_name:  drugName,
      doses_per_day:  Number(dosesPerDay),
      gap_hours:      Number(gapHours),
      duration_days:  Number(durationDays),
      // start_date omitted → backend defaults to today
      notes: notes || null,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/medication/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
      Alert.alert("Medication created" , "success");
        setTimeout(() => router.back(), 1500);
      } else {
        throw new Error(data?.error || "Failed to create");
      }
    } catch (err) {
      Alert.alert(err.message, "error");
    }
  };

  // -------------- UI --------------
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Medication</Text>

      <Text style={styles.label}>Medicine / Drug Name</Text>
      <TextInput style={styles.input} value={drugName} onChangeText={setDrugName} />

      <Text style={styles.label}>Doses per day</Text>
      <TextInput
        style={styles.input}
        value={dosesPerDay}
        onChangeText={setDosesPerDay}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Gap between doses (hours)</Text>
      <TextInput
        style={styles.input}
        value={gapHours}
        onChangeText={setGapHours}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Duration (days)</Text>
      <TextInput
        style={styles.input}
        value={durationDays}
        onChangeText={setDuration}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleCreate}>
        <Text style={styles.updateButtonText}>Save Medication</Text>
      </TouchableOpacity>

    </View>
  );
}

const toastConfig = {
  success: ({ text1 }) => (
    <View style={styles.successToast}>
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  ),
};

// ---- styling identical to profile screen (copied) ----
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 5, color: "#333" },
  input: {
    height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    paddingHorizontal: 15, marginBottom: 15,
  },
  updateButton: {
    backgroundColor: "#284b63", padding: 15, borderRadius: 8, alignItems: "center",
  },
  updateButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  successToast: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#4CAF50",
    padding: 10, borderRadius: 25, width: "80%", alignSelf: "center", justifyContent: "center",
  },
  toastText: { color: "white", fontSize: 16, marginLeft: 10 },
});

export default CreateMedicationScreen;
