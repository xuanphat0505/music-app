import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ToastConfigParams } from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

// Định nghĩa giao diện tùy chỉnh cho thông báo Toast đồng bộ với theme tối MusicHub
export const toastConfig = {
  success: (props: ToastConfigParams<any>) => (
    <View style={[styles.toastContainer, styles.borderSuccess]}>
      <View style={[styles.iconContainer, styles.bgSuccess]}>
        <Feather name="check" size={18} color="#ffffff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{props.text1}</Text>
        {props.text2 ? <Text style={styles.subtitleText}>{props.text2}</Text> : null}
      </View>
    </View>
  ),
  error: (props: ToastConfigParams<any>) => (
    <View style={[styles.toastContainer, styles.borderError]}>
      <View style={[styles.iconContainer, styles.bgError]}>
        <Feather name="alert-triangle" size={18} color="#ffffff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{props.text1}</Text>
        {props.text2 ? <Text style={styles.subtitleText}>{props.text2}</Text> : null}
      </View>
    </View>
  ),
  info: (props: ToastConfigParams<any>) => (
    <View style={[styles.toastContainer, styles.borderInfo]}>
      <View style={[styles.iconContainer, styles.bgInfo]}>
        <Feather name="info" size={18} color="#ffffff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{props.text1}</Text>
        {props.text2 ? <Text style={styles.subtitleText}>{props.text2}</Text> : null}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: "rgba(28, 31, 48, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  titleText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Outfit",
  },
  subtitleText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 13,
    fontFamily: "Inter",
    marginTop: 2,
  },
  borderSuccess: {
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
    borderTopLeftRadius:0,
    borderBottomLeftRadius:0,
  },
  borderError: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
    borderTopLeftRadius:0,
    borderBottomLeftRadius:0,
  },
  borderInfo: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
    borderTopLeftRadius:0,
    borderBottomLeftRadius:0,
  },
  bgSuccess: {
    backgroundColor: "#10b981",
  },
  bgError: {
    backgroundColor: "#ef4444",
  },
  bgInfo: {
    backgroundColor: COLORS.PRIMARY,
  },
});
