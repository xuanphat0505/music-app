import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/constants/Colors";

interface VoiceSearchOverlayProps {
  visible: boolean;
  onClose: () => void;
  onSpeechResult: (result: string) => void;
}

// Component lớp phủ hiển thị giao diện giả lập tìm kiếm bằng giọng nói với hiệu ứng sóng âm hoạt họa
export const VoiceSearchOverlay: React.FC<VoiceSearchOverlayProps> = ({
  visible,
  onClose,
  onSpeechResult,
}) => {
  // Mảng chứa các giá trị scale Animated cho 5 thanh sóng âm chạy song song
  const animValues = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.6),
    new Animated.Value(0.4),
    new Animated.Value(0.8),
    new Animated.Value(0.3),
  ]).current;

  // Khởi động chuỗi hiệu ứng hoạt họa thay đổi độ cao ngẫu nhiên cho từng thanh sóng âm
  const startWaveAnimation = (index: number) => {
    Animated.sequence([
      Animated.timing(animValues[index], {
        toValue: Math.random() * 1.4 + 0.4,
        duration: Math.random() * 200 + 200,
        useNativeDriver: true,
      }),
      Animated.timing(animValues[index], {
        toValue: 0.3,
        duration: Math.random() * 200 + 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (visible) {
        startWaveAnimation(index);
      }
    });
  };

  useEffect(() => {
    let mockTimeout: any;

    if (visible) {
      // Rung nhẹ báo hiệu thiết bị bắt đầu lắng nghe giọng nói
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );

      // Kích hoạt hoạt họa sóng âm chạy song song cho cả năm thanh
      animValues.forEach((_, index) => startWaveAnimation(index));

      // Giả lập nhận diện thành công sau ba giây và điền từ khóa kết quả
      mockTimeout = setTimeout(() => {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => {});
        onSpeechResult("Midnight Blue");
      }, 3500);
    }

    return () => {
      clearTimeout(mockTimeout);
    };
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={70} tint="dark" style={styles.blurContainer}>
        <View style={styles.contentContainer}>
          {/* Lời nhắc hành động */}
          <Text style={styles.listeningTitle}>Listening...</Text>
          <Text style={styles.listeningSubtitle}>
            Try saying the name of a song or artist
          </Text>

          {/* Khu vực hiển thị sóng âm động */}
          <View style={styles.waveformContainer}>
            {animValues.map((value, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.waveBarWrapper,
                  { transform: [{ scaleY: value }] },
                ]}
              >
                <LinearGradient
                  colors={[COLORS.PRIMARY, COLORS.SECONDARY]}
                  style={styles.waveBar}
                />
              </Animated.View>
            ))}
          </View>

          <Text style={styles.hintText}>Say "Midnight Blue" or "Velocity"</Text>

          {/* Nút hủy bỏ đóng giao diện giọng nói */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Feather name="x" size={24} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(9, 11, 17, 1)",
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
    width: "100%",
  },
  listeningTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 8,
  },
  listeningSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    textAlign: "center",
    marginBottom: 60,
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    gap: 8,
    marginBottom: 40,
  },
  waveBarWrapper: {
    height: 80,
    justifyContent: "center",
  },
  waveBar: {
    width: 6,
    height: "100%",
    borderRadius: 3,
  },
  hintText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    fontStyle: "italic",
    marginBottom: 80,
  },
  cancelButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
});
