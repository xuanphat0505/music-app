import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { SongItem } from "../common";
import { Track } from "@/types";

interface RecentlyPlayedSectionProps {
  recentlyPlayed: Track[];
  onPlaySong: (track: Track) => void;
}

// Component phân mục bài hát phát gần đây hiển thị danh sách bài hát lịch sử và xử lý trạng thái trống
export const RecentlyPlayedSection: React.FC<RecentlyPlayedSectionProps> = ({
  recentlyPlayed,
  onPlaySong,
}) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, styles.sectionTitleSpacing]}>
        Recently Played
      </Text>

      {recentlyPlayed.length > 0 ? (
        <View style={styles.songsList}>
          {recentlyPlayed.map((song) => (
            <SongItem
              key={song._id}
              song={song}
              onPress={() => onPlaySong(song)}
              duration={song.duration}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recently played songs</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  sectionTitleSpacing: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  songsList: {
    paddingHorizontal: 20,
  },
  moreButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    fontSize: 13,
  },
});
