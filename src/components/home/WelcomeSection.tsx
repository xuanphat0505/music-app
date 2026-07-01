import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/constants/Colors";

// Thành phần chào mừng hiển thị lời chào động thay đổi theo giờ thực tế của người dùng
export const WelcomeSection: React.FC = () => {
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  let subGreeting = "Ready for your nightly session?";

  // Xác định lời chào và câu chúc phù hợp dựa trên giờ hiện tại của thiết bị
  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
    subGreeting = "Start your day with some fresh music.";
  } else if (hour >= 12 && hour < 18) {
    greeting = "Good Afternoon";
    subGreeting = "Keep your energy high this afternoon.";
  }

  return (
    <View style={styles.welcomeSection}>
      <Text style={styles.greeting}>
        {greeting}, <Text style={styles.userName}>Alex</Text>
      </Text>
      <Text style={styles.subGreeting}>{subGreeting}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  userName: {
    color: COLORS.PRIMARY,
  },
  subGreeting: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    marginTop: 4,
  },
});
