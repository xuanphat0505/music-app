import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { GlassView } from "@/components/common";

export interface SettingItem {
  id: string;
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
  isDestructive?: boolean;
}

interface SettingsGroupProps {
  title: string;
  items: SettingItem[];
}

// Component hiển thị nhóm các cài đặt ứng dụng sử dụng Glassmorphism
export const SettingsGroup: React.FC<SettingsGroupProps> = ({ title, items }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.groupTitle}>{title}</Text>
      <GlassView style={styles.groupCard}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.settingRow,
              index < items.length - 1 && styles.borderBottom,
            ]}
            activeOpacity={0.7}
            onPress={item.onPress}
          >
            <View style={styles.leftContainer}>
              <Feather
                name={item.icon as any}
                size={18}
                color={item.isDestructive ? "#ef4444" : COLORS.TEXT_SECONDARY}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.label,
                  item.isDestructive && styles.destructiveText,
                ]}
              >
                {item.label}
              </Text>
            </View>

            <View style={styles.rightContainer}>
              {item.value && <Text style={styles.valueText}>{item.value}</Text>}
              <Feather
                name="chevron-right"
                size={16}
                color="rgba(255, 255, 255, 0.2)"
              />
            </View>
          </TouchableOpacity>
        ))}
      </GlassView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 1.5,
    fontFamily: "Outfit",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  groupCard: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Inter",
  },
  destructiveText: {
    color: "#ef4444",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  valueText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
  },
});
