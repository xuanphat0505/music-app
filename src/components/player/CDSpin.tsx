import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";
import { COLORS } from "@/constants/Colors";

interface CDSpinProps {
  coverUrl: string;
  isPlaying: boolean;
}

// Component mâm đĩa CD xoay tròn có kèm viền phát sáng Neon đổi màu mượt mà
export const CDSpin: React.FC<CDSpinProps> = ({ coverUrl, isPlaying }) => {
  const rotation = useSharedValue(0);
  const [imageError, setImageError] = useState(false);

  // Khởi tạo lại lỗi ảnh khi thay đổi ảnh bìa mới
  useEffect(() => {
    setImageError(false);
  }, [coverUrl]);

  // Kích hoạt hoặc tạm dừng hoạt họa xoay đĩa CD dựa theo trạng thái phát nhạc
  useEffect(() => {
    if (isPlaying) {
      rotation.value = withRepeat(
        withTiming(rotation.value + 360, {
          duration: 12000,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    } else {
      cancelAnimation(rotation);
    }
  }, [isPlaying, rotation]);

  // Đặt lại góc xoay về 0 khi đổi bài hát mới (ảnh bìa thay đổi) giúp ảnh bìa hiển thị thẳng đứng
  useEffect(() => {
    cancelAnimation(rotation);
    rotation.value = 0;
    if (isPlaying) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 12000,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    }
  }, [coverUrl]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const artworkUrl =
    coverUrl && coverUrl.trim() !== "" && !imageError
      ? coverUrl
      : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300";

  return (
    <View style={styles.container}>
      <View style={[styles.glowRing, styles.glowOuter]} />
      <View style={[styles.glowRing, styles.glowInner]} />

      <Animated.View style={[styles.vinylPlate, animatedStyle]}>
        <View style={styles.grooveRing} />
        <Image
          source={{ uri: artworkUrl }}
          style={styles.albumArt}
          onError={() => setImageError(true)}
        />
        <View style={styles.centerHole} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  glowRing: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 2,
  },
  glowOuter: {
    borderColor: "rgba(0, 229, 201, 0.4)",
    transform: [{ scale: 1.12 }],
    shadowColor: COLORS.SECONDARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  glowInner: {
    borderColor: COLORS.PRIMARY,
    transform: [{ scale: 1.05 }],
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  vinylPlate: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#0d0e12",
    borderWidth: 6,
    borderColor: "#1a1c24",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  grooveRing: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  albumArt: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.SURFACE,
  },
  centerHole: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#0d0e12",
    borderWidth: 2,
    borderColor: "#1a1c24",
  },
});
