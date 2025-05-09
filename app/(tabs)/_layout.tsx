import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import DoctorProfileScreen from './profile'; 
import DocterChartsScreen from './chart';
import DoctorHomeScreen from './home';
import DoctorChatScreen from './chat'; 

// Screens
function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Text style={{ color: "#284b63", fontSize: 20, fontWeight: "bold" }}>Home - Medication Reminders</Text>
    </View>
  );
}

function ChatScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Text style={{ color: "#284b63", fontSize: 20, fontWeight: "bold" }}>Chat with Doctor</Text>
    </View>
  );
}

function ChartsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Text style={{ color: "#284b63", fontSize: 20, fontWeight: "bold" }}>Medication Tracking Charts</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Text style={{ color: "#284b63", fontSize: 20, fontWeight: "bold" }}>Profile</Text>
    </View>
  );
}

// Tab Navigator
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Chat") {
            iconName = "chatbubbles";
          } else if (route.name === "Charts") {
            iconName = "bar-chart";
          } else if (route.name === "Profile") {
            iconName = "person";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#284b63",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff" },
        headerStyle: { backgroundColor: "#284b63" },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
      })}
    >
      <Tab.Screen name="Home" component={DoctorHomeScreen} />
      <Tab.Screen name="Chat" component={DoctorChatScreen} />
      <Tab.Screen name="Charts" component={DocterChartsScreen} />
      <Tab.Screen name="Profile" component={DoctorProfileScreen} />

      
    </Tab.Navigator>
  );
}
