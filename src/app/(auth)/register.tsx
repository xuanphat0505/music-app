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
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { COLORS } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";
import { showError, showInfo, showSuccess } from "@/utils/toast";

// Màn hình Đăng ký tài khoản mới phong cách tối giản phẳng đồng bộ với màn hình đăng nhập
export default function RegisterScreen() {
  const { register, isLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Tạo phản hồi rung xúc giác khi tương tác nút bấm
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  // Danh sách các quy tắc kiểm tra điều kiện mật khẩu
  const passwordRules = [
    {
      label: "Mật khẩu phải chứa ít nhất 8 ký tự",
      valid: password.length >= 8,
    },
    {
      label: "Chứa ít nhất một chữ số (0-9)",
      valid: /\d/.test(password),
    },
    {
      label: "Chứa ít nhất một ký tự đặc biệt",
      valid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  // Hàm xử lý kiểm tra biểu mẫu và thực hiện đăng ký tài khoản mới
  const handleRegister = async () => {
    triggerHaptic();
    if (!username.trim() || !email.trim() || !password.trim()) {
      showError("Lỗi đăng ký", "Vui lòng nhập đầy đủ tất cả các thông tin.");
      return;
    }

    const isLengthValid = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!isLengthValid || !hasNumber || !hasSpecial) {
      showError(
        "Lỗi đăng ký",
        "Mật khẩu không đáp ứng đầy đủ yêu cầu bảo mật.",
      );
      return;
    }

    try {
      const success = await register(email, username, password);
      
      if (success) {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => {});
        showSuccess("Đăng ký thành công", "Vui lòng đăng nhập với tài khoản mới.");
        router.replace("/(auth)/login");
      }
    } catch (error: any) {
      console.log("error: ", error);
      showError("Đăng ký thất bại", error?.message);
    }
  };

  // Hàm xử lý đăng ký tài khoản giả lập qua mạng xã hội
  const handleSocialRegister = (platform: string) => {
    triggerHaptic();
    showInfo(
      "Tính năng liên kết",
      `Chức năng liên kết tài khoản bằng ${platform} đang được xử lý.`,
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
              {/* Trường nhập Email */}
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

              {/* Trường nhập Username */}
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === "username" && styles.inputWrapperFocused,
                ]}
              >
                <Feather
                  name="user"
                  size={18}
                  color={
                    focusedField === "username"
                      ? COLORS.PRIMARY
                      : COLORS.TEXT_SECONDARY
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  value={username}
                  onChangeText={setUsername}
                  onFocus={() => {
                    setFocusedField("username");
                  }}
                  onBlur={() => {
                    setFocusedField(null);
                  }}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              {/* Trường nhập Mật khẩu */}
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
                  
              {/* Yêu cầu kiểm tra Mật khẩu */}
              <View style={styles.requirementsContainer}>
                {passwordRules.map((rule, idx) => (
                  <View key={idx} style={styles.requirementRow}>
                    <Feather
                      name={rule.valid ? "check-circle" : "x-circle"}
                      size={13}
                      color={
                        rule.valid ? "#10b981" : "rgba(255, 255, 255, 0.2)"
                      }
                      style={styles.requirementIcon}
                    />
                    <Text
                      style={[
                        styles.requirementText,
                        {
                          color: rule.valid
                            ? "#34d399"
                            : "rgba(255, 255, 255, 0.4)",
                        },
                      ]}
                    >
                      {rule.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Nút Đăng ký màu phẳng */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
                style={styles.registerButton}
              >
                <View
                  style={[
                    styles.registerButtonContent,
                    { backgroundColor: COLORS.PRIMARY },
                  ]}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.registerButtonText}>Sign Up</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Đường dẫn sang trang Đăng nhập */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic();
                  router.push("/(auth)/login");
                }}
              >
                <Text style={styles.footerLinkText}>Sign In</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.socialSection}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or join with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtonsRow}>
                <TouchableOpacity
                  onPress={() => handleSocialRegister("Google")}
                  style={styles.socialButton}
                >
                  <Ionicons name="logo-google" size={20} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSocialRegister("Apple")}
                  style={styles.socialButton}
                >
                  <Ionicons name="logo-apple" size={20} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSocialRegister("Audius")}
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
    gap: 12,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    height: 52,
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
  registerButton: {
    marginTop: 10,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  registerButtonContent: {
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Outfit",
    letterSpacing: 0.5,
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
  socialSection: {
    width: "100%",
    gap: 16,
    marginBottom: 8,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  requirementsContainer: {
    paddingHorizontal: 4,
    paddingVertical: 6,
    gap: 6,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  requirementIcon: {
    marginRight: 8,
  },
  requirementText: {
    fontSize: 12,
    fontFamily: "Inter",
  },
});
