import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/constants/Colors";
import { MOCK_ALL_TRACKS } from "@/constants/MockData";
import { usePlayerStore } from "@/store/playerStore";
import { SongContainer } from "@/components/common";
import { Category, Track } from "@/types";

interface CategoryDetailProps {
  category: Category;
  onBack: () => void;
}

// Component chi tiết thể loại nhạc hiển thị danh sách bài hát thuộc thể loại đó
export const CategoryDetail: React.FC<CategoryDetailProps> = ({
  category,
  onBack,
}) => {
  const playTrack = usePlayerStore((state) => state.playTrack);

  // Lọc danh sách bài hát thuộc thể loại nhạc này từ danh sách giả lập
  const filteredSongs = MOCK_ALL_TRACKS.filter(
    (song) => song.genre.toLowerCase() === category.title.toLowerCase()
  );

  // Hàm xử lý phát nhạc và phản hồi rung khi chạm chọn bài hát trong danh mục
  const handlePlaySong = (track: Track) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    playTrack(track);
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại và Tiêu đề thể loại */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.title}</Text>
      </View>

      {/* Thẻ banner thể loại gradient */}
      <LinearGradient
        colors={category.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <Text style={styles.bannerTitle}>Explore {category.title} Music</Text>
        <Text style={styles.bannerSubtitle}>
          Discover the top tracks in the {category.title} category.
        </Text>
        <Image
          source={{ uri: category.coverUrl }}
          style={styles.bannerImage}
        />
      </LinearGradient>

      {/* Danh sách bài hát */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        <Text style={styles.sectionTitle}>Popular Tracks</Text>
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => {
            return (
              <SongContainer
                key={song.id}
                song={song}
                subtitle={`${song.artist} • ${song.plays} plays`}
                onPress={() => handlePlaySong(song)}
                rightElement={
                  <TouchableOpacity
                    style={styles.moreButton}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name="more-vertical"
                      size={18}
                      color={COLORS.TEXT_SECONDARY}
                    />
                  </TouchableOpacity>
                }
              />
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No tracks found in this category
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  banner: {
    borderRadius: 16,
    padding: 20,
    position: "relative",
    overflow: "hidden",
    height: 140,
    justifyContent: "center",
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    fontFamily: "Outfit",
    marginBottom: 4,
    maxWidth: "70%",
  },
  bannerSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "Inter",
    maxWidth: "65%",
    lineHeight: 16,
  },
  bannerImage: {
    width: 90,
    height: 90,
    position: "absolute",
    bottom: -15,
    right: -15,
    transform: [{ rotate: "15deg" }],
    borderRadius: 8,
    opacity: 0.9,
  },
  scrollList: {
    paddingBottom: 220,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 16,
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
  },
});
export default CategoryDetail;
