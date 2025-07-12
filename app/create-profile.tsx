import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import { API_BASE_URL } from "../utils/constants";
import { useAuthStore } from "../store/authStore";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CreateDoctorProfileScreen() {
  const router = useRouter();
  const { token, uid, setLocalId } = useAuthStore();

  const [fullName, setFullName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [about, setAbout] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [workingHours, setWorkingHours] = useState(
    weekdays.reduce((acc, day) => {
      acc[day.toLowerCase()] = { start: null, end: null };
      return acc;
    }, {})
  );

  const [pickerState, setPickerState] = useState({
    visible: false,
    day: "",
    type: "start", // 'start' or 'end'
    value: new Date(),
  });

  const showTimePicker = (day, type) => {
    setPickerState({
      visible: true,
      day,
      type,
      value: new Date(),
    });
  };

  const onTimeChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setPickerState({ ...pickerState, visible: false });
      return;
    }

    const time = selectedDate || pickerState.value;
    const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setWorkingHours((prev) => ({
      ...prev,
      [pickerState.day]: {
        ...prev[pickerState.day],
        [pickerState.type]: timeStr,
      },
    }));

    setPickerState({ ...pickerState, visible: false });
  };

  const handleCreateProfile = async () => {
    if (!fullName || !specialization || !phoneNumber || !clinicAddress) {
      Alert.alert("All fields are required except 'About'.","error");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/doctor/profile/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: fullName,
          specialization,
          about,
          phone_number: phoneNumber,
          clinic_address: clinicAddress,
          working_hours: workingHours,
        }),
      });

      const data = await response.json();

      if (response.ok && data.id) {
        setLocalId(data.id);
        Alert.alert("Profile created successfully", "success");
        setTimeout(() => router.push("/home"), 1500);
      } else {
        throw new Error(data?.error || "Profile creation failed");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create Doctor Profile</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

      <Text style={styles.label}>Specialization</Text>
      <TextInput style={styles.input} value={specialization} onChangeText={setSpecialization} />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />

      <Text style={styles.label}>Clinic Address</Text>
      <TextInput style={styles.input} value={clinicAddress} onChangeText={setClinicAddress} />

      <Text style={styles.label}>About</Text>
      <TextInput style={styles.input} value={about} onChangeText={setAbout} multiline />

      <Text style={[styles.label, { marginTop: 10 }]}>Working Hours</Text>
      {weekdays.map((day) => {
        const key = day.toLowerCase();
        const times = workingHours[key];
        return (
          <View key={day} style={styles.dayRow}>
            <Text style={{ width: 80 }}>{day}</Text>

            <TouchableOpacity
              onPress={() => showTimePicker(key, "start")}
              style={styles.timeButton}
            >
              <Text>{times.start || "Start Time"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => showTimePicker(key, "end")}
              style={styles.timeButton}
            >
              <Text>{times.end || "End Time"}</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity style={styles.submitButton} onPress={handleCreateProfile}>
        <Text style={styles.submitButtonText}>Create Profile</Text>
      </TouchableOpacity>

      {pickerState.visible && (
        <DateTimePicker
          mode="time"
          display={Platform.OS === "android" ? "default" : "spinner"}
          value={pickerState.value}
          onChange={onTimeChange}
        />
      )}
    </ScrollView>
  );
}

const toastConfig = {
  success: ({ text1 }) => (
    <View style={styles.successToast}>
      <CheckCircle size={20} color="white" />
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 5, color: "#333" },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#e7eaf1",
    borderRadius: 6,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#284b63",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  successToast: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 25,
    width: "80%",
    alignSelf: "center",
    justifyContent: "center",
  },
  toastText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
});
