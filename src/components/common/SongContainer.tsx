import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { COLORS } from "@/constants/Colors";
import { usePlayerStore } from "@/store/playerStore";
import { GlassView } from "./GlassView";
import { Track } from "@/types";

interface SongContainerProps {
  song: Track;
  subtitle?: string;
  rightElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

// Component dùng chung hiển thị một dòng thông tin bài hát trong hộp kính mờ
export const SongContainer: React.FC<SongContainerProps> = ({
  song,
  subtitle,
  rightElement,
  style,
  onPress,
}) => {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isActive = currentTrack?.id === song.id;

  return (
    <GlassView
      style={[
        styles.container,
        isActive ? styles.activeContainer : undefined,
        style,
      ]}
    >
      <TouchableOpacity
        style={styles.clickableArea}
        activeOpacity={0.7}
        onPress={onPress}
      >
        <Image source={{ uri: song.coverUrl }} style={styles.cover} />
        <View style={styles.infoContainer}>
          <Text
            style={[styles.title, isActive && styles.activeTitle]}
            numberOfLines={1}
          >
            {song.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle || song.artist}
          </Text>
        </View>
      </TouchableOpacity>

      {rightElement && (
        <View style={styles.actionContainer}>{rightElement}</View>
      )}
    </GlassView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 10,
  },
  activeContainer: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: "rgba(124, 58, 237, 0.15)",
  },
  clickableArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.SURFACE,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 2,
  },
  activeTitle: {
    color: COLORS.PRIMARY,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});