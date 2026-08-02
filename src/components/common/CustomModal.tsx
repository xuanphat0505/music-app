import React from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { GlassView } from "./GlassView";

export interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  cancelText?: string;
  onCancel?: () => void;
  confirmText: string;
  onConfirm: () => void;
  isConfirmDestructive?: boolean;
  children?: React.ReactNode;
}

// Component hộp thoại tùy chỉnh hỗ trợ làm mờ nền bằng BlurView và hiển thị kiểu kính mờ Glassmorphism
export const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  message,
  icon,
  iconColor = COLORS.PRIMARY,
  iconBgColor,
  cancelText,
  onCancel,
  confirmText,
  onConfirm,
  isConfirmDestructive = false,
  children,
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const defaultIconBgColor =
    iconBgColor ||
    (isConfirmDestructive
      ? "rgba(239, 68, 68, 0.12)"
      : "rgba(255, 122, 0, 0.12)");

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
            <GlassView style={styles.modalContent}>
              {icon && (
                <View
                  style={[
                    styles.iconWrapper,
                    { backgroundColor: defaultIconBgColor },
                  ]}
                >
                  <Feather name={icon as any} size={26} color={iconColor} />
                </View>
              )}

              <Text style={styles.title}>{title}</Text>

              {message && <Text style={styles.message}>{message}</Text>}

              {children}

              <View style={styles.buttonContainer}>
                {cancelText && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelText}>{cancelText}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    isConfirmDestructive
                      ? styles.destructiveButton
                      : styles.primaryButton,
                  ]}
                  onPress={handleConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </GlassView>
          </TouchableOpacity>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    width: "85%",
    maxWidth: 340,
  },
  modalContent: {
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(24, 24, 28, 0.96)",
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  confirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  destructiveButton: {
    backgroundColor: "#ef4444",
  },
  confirmText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    fontFamily: "Outfit",
  },
});
