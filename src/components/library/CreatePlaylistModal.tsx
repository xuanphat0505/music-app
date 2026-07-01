import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { COLORS } from "@/constants/Colors";

interface CreatePlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (title: string, desc: string) => void;
}

// Component hộp thoại kính mờ hỗ trợ người dùng nhập thông tin tạo danh sách phát mới
export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  visible,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  // Hàm xử lý khi người dùng nhấn nút xác nhận tạo danh sách phát
  const handleConfirmCreate = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Playlist name cannot be empty");
      return;
    }
    onCreate(title.trim(), desc.trim());
    setTitle("");
    setDesc("");
  };

  // Hàm xử lý đóng hộp thoại và đặt lại toàn bộ trạng thái ô nhập liệu
  const handleCancel = () => {
    setTitle("");
    setDesc("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <BlurView intensity={70} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create Playlist</Text>

          <TextInput
            placeholder="Playlist name"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            style={styles.modalInput}
            value={title}
            onChangeText={setTitle}
            maxLength={32}
          />

          <TextInput
            placeholder="Description (optional)"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            style={styles.modalInput}
            value={desc}
            onChangeText={setDesc}
            maxLength={60}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.createButton]}
              onPress={handleConfirmCreate}
              activeOpacity={0.7}
            >
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(9, 11, 17, 0.85)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: COLORS.SURFACE,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Inter",
    fontSize: 14,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
  },
  cancelButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "600",
  },
  createButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  createButtonText: {
    color: "#ffffff",
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "600",
  },
});
