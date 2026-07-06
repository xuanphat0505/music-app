import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";

import { COLORS } from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";

// Màn hình Đăng nhập mang phong cách kính mờ cao cấp với màu sắc nhấn neon
export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Kích hoạt phản hồi rung xúc giác khi tương tác nút
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  // Hàm xử lý đăng nhập tài khoản mật khẩu
  const handleLogin = async () => {
    triggerHaptic();
    if (!email.trim() || !password.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
        () => {},
      );
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => {});
        router.replace("/(tabs)");
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
        () => {},
      );
      Alert.alert(
        "Lỗi",
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
      );
    }
  };

  // Hàm xử lý đăng nhập giả lập thông qua mạng xã hội
  const handleSocialLogin = (platform: string) => {
    triggerHaptic();
    Alert.alert(
      "Đăng nhập MXH",
      `Chức năng đăng nhập bằng ${platform} đang được xử lý.`,
    );
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoSection}>
              <Text style={styles.brandName}>MusicHub</Text>
              <Text style={styles.brandTagline}>PREMIUM AUDIO EXPERIENCE</Text>
            </View>

            <View style={styles.formSection}>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === "email" && styles.inputWrapperFocused,
                ]}
              >
                <Feather
                  name="mail"
                  size={18}
                  color={
                    focusedField === "email"
                      ? COLORS.PRIMARY
                      : COLORS.TEXT_SECONDARY
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View
                style={[
                  styles.inputWrapper,
                  focusedField === "password" && styles.inputWrapperFocused,
                ]}
              >
                <Feather
                  name="lock"
                  size={18}
                  color={
                    focusedField === "password"
                      ? COLORS.PRIMARY
                      : COLORS.TEXT_SECONDARY
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color={COLORS.TEXT_SECONDARY}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={triggerHaptic}
                style={styles.forgotPasswordButton}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
                style={styles.loginButton}
              >
                <View
                  style={[
                    styles.loginButtonContent,
                    { backgroundColor: COLORS.PRIMARY },
                  ]}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Đường dẫn sang trang Đăng ký */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic();
                  router.push("/(auth)/register");
                }}
              >
                <Text style={styles.footerLinkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.socialSection}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtonsRow}>
                <TouchableOpacity
                  onPress={() => handleSocialLogin("Google")}
                  style={styles.socialButton}
                >
                  <Ionicons name="logo-google" size={20} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSocialLogin("Apple")}
                  style={styles.socialButton}
                >
                  <Ionicons name="logo-apple" size={20} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSocialLogin("Audius")}
                  style={styles.socialButton}
                >
                  <Feather name="music" size={18} color={COLORS.PRIMARY} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 24,
  },
  brandName: {
    fontSize: 38,
    fontWeight: "900",
    color: "#b2bdfb",
    fontFamily: "Outfit",
    letterSpacing: 1,
    marginBottom: 6,
  },
  brandTagline: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    letterSpacing: 1.5,
    fontWeight: "600",
  },
  formSection: {
    width: "100%",
    gap: 16,
    marginTop: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    height: 54,
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Inter",
  },
  eyeButton: {
    padding: 8,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    paddingVertical: 4,
  },
  forgotPasswordText: {
    color: COLORS.PRIMARY,
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Inter",
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonContent: {
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Outfit",
    letterSpacing: 0.5,
  },
  socialSection: {
    width: "100%",
    gap: 20,
    marginBottom: 16,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  dividerText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    fontFamily: "Inter",
  },
  socialButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  footerText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    fontFamily: "Inter",
  },
  footerLinkText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter",
  },
});
