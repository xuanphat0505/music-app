import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

interface ScrollToTopButtonProps {
  visible: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

// Component nút cuộn nổi cuộn mượt về đầu trang với hiệu ứng chuyển động mượt mượt
export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  visible,
  onPress,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Tự động kích hoạt hiệu ứng hiển thị hoặc ẩn nút khi thay đổi trạng thái visible
  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      friction: 7,
      tension: 40,
    }).start();
  }, [visible, animatedValue]);

  if (!visible) return null;

  const animatedStyle = {
    opacity: animatedValue,
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 1],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.button}
      >
        <Feather name="arrow-up" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 80,
    zIndex: 99,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
