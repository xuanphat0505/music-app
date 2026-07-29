import { COLORS } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ImageMenuProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onSelectImage: () => void;
  onViewAvatar: () => void;
  menuAnim: Animated.Value;
}

export const ImageMenu: React.FC<ImageMenuProps> = ({
  visible,
  onClose,
  onTakePhoto,
  onViewAvatar,
  onSelectImage,
  menuAnim,
}) => {
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.menuOverlay}>
        <TouchableOpacity
          style={styles.menuOverlayClose}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.menuContent,
            { transform: [{ translateY: menuAnim }] },
          ]}
        >
          <View style={styles.menuIndicator} />
          <Text style={styles.menuTitle}>Anh đại diện</Text>

          <TouchableOpacity style={styles.menuItem} onPress={onViewAvatar}>
            <Feather
              name="user"
              size={20}
              color={COLORS.TEXT_PRIMARY}
              style={styles.menuItemIcon}
            />
            <Text style={styles.menuItemText}>Xem ảnh đại diện</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onTakePhoto}>
            <Feather
              name="camera"
              size={20}
              color={COLORS.TEXT_PRIMARY}
              style={styles.menuItemIcon}
            />
            <Text style={styles.menuItemText}>Chụp ảnh mới</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onSelectImage}>
            <Feather
              name="image"
              size={20}
              color={COLORS.TEXT_PRIMARY}
              style={styles.menuItemIcon}
            />
            <Text style={styles.menuItemText}>Chọn ảnh trên máy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.menuCancelItem]}
            onPress={() => onClose()}
          >
            <Text style={styles.menuCancelText}>Hủy</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
    zIndex: 10000,
  },
  menuOverlayClose: {
    ...StyleSheet.absoluteFillObject,
  },
  menuContent: {
    backgroundColor: COLORS.SURFACE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  menuIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 16,
    textAlign: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  menuItemIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Inter",
  },
  menuCancelItem: {
    borderBottomWidth: 0,
    marginTop: 8,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    paddingVertical: 12,
  },
  menuCancelText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.PRIMARY,
    fontFamily: "Outfit",
    textAlign: "center",
  },
});
