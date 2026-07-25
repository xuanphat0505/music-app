import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

export type SortOptionValue = "recent" | "title" | "artist";

export interface SortOption {
  label: string;
  value: SortOptionValue;
  icon: keyof typeof Feather.glyphMap;
}

interface SortOptionModalProps {
  visible: boolean;
  currentSort: SortOptionValue;
  onSelect: (value: SortOptionValue) => void;
  onClose: () => void;
}

const SORT_OPTIONS: SortOption[] = [
  { label: "Mới lưu gần đây", value: "recent", icon: "clock" },
  { label: "Tên bài hát (A - Z)", value: "title", icon: "type" },
  { label: "Tên ca sĩ (A - Z)", value: "artist", icon: "user" },
];

// Component Modal lựa chọn phương thức sắp xếp danh sách bài hát trong Thư viện
export const SortOptionModal: React.FC<SortOptionModalProps> = ({
  visible,
  currentSort,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>Sắp xếp bài hát</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Feather name="x" size={20} color={COLORS.TEXT_SECONDARY} />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsList}>
                {SORT_OPTIONS.map((option) => {
                  const isSelected = currentSort === option.value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionItem,
                        isSelected && styles.selectedOptionItem,
                      ]}
                      onPress={() => {
                        onSelect(option.value);
                        onClose();
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionLeft}>
                        <Feather
                          name={option.icon}
                          size={18}
                          color={
                            isSelected ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY
                          }
                        />
                        <Text
                          style={[
                            styles.optionLabel,
                            isSelected && styles.selectedOptionLabel,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </View>

                      {isSelected && (
                        <Feather
                          name="check"
                          size={18}
                          color={COLORS.PRIMARY}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#18181b",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  closeBtn: {
    padding: 4,
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  selectedOptionItem: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionLabel: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    fontWeight: "500",
  },
  selectedOptionLabel: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "700",
  },
});
