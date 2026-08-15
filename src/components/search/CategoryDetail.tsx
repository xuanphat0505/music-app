import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/constants/Colors";
import { useSongs } from "@/hooks/useSongs";
import { usePlayerStore } from "@/store/playerStore";
import { useLibrarySongs } from "@/hooks/useLibrarySongs";
import { usePlaylistStore } from "@/store/playlistStore";
import { SongItem } from "@/components/common";
import { AddToPlaylistModal, CreatePlaylistModal } from "@/components/library";
import { Category, Track } from "@/types";
import { formatArtistNames } from "@/utils/artist";
import { showSuccess } from "@/utils/toast";

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
  const { isSongInLibrary, toggleSong } = useLibrarySongs();
  const { createPlaylist, addSongToPlaylist } = usePlaylistStore();

  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] = useState<Track | null>(null);
  const [isAddToPlaylistVisible, setIsAddToPlaylistVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  // Lấy danh sách bài hát thuộc thể loại nhạc từ API thực tế
  const { songs: filteredSongs, isLoading } = useSongs({
    genre: category.title,
  });

  // Hàm xử lý phát nhạc và phản hồi rung khi chạm chọn bài hát trong danh mục
  const handlePlaySong = (track: Track) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    playTrack(track);
  };

  // Mở hộp thoại thêm bài hát vào danh sách phát
  const handleOpenAddToPlaylist = (track: Track) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSelectedTrackForPlaylist(track);
    setIsAddToPlaylistVisible(true);
  };

  // Tạo mới danh sách phát từ hộp thoại và lưu bài hát hiện tại vào đó
  const handleCreatePlaylist = async (title: string, desc: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const created = await createPlaylist(title, desc);
    setIsCreateModalVisible(false);
    if (created) {
      if (selectedTrackForPlaylist) {
        await addSongToPlaylist(created._id, selectedTrackForPlaylist);
        setSelectedTrackForPlaylist(null);
        showSuccess(`Đã tạo và thêm vào "${created.title}"`);
      } else {
        showSuccess(`Đã tạo danh sách phát "${created.title}"`);
      }
    } else {
      setSelectedTrackForPlaylist(null);
    }
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
        <Image source={{ uri: category.coverUrl }} style={styles.bannerImage} />
      </LinearGradient>

      {/* Danh sách bài hát */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        <Text style={styles.sectionTitle}>Popular Tracks</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={COLORS.PRIMARY} style={{ marginVertical: 20 }} />
        ) : filteredSongs.length > 0 ? (
          filteredSongs.map((song) => {
            return (
              <SongItem
                  key={song._id}
                  song={song}
                  subtitle={formatArtistNames(song.artists)}
                  duration={song.duration}
                  isAdded={isSongInLibrary(song._id)}
                  onPress={() => handlePlaySong(song)}
                  onAddPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    toggleSong(song);
                  }}
                  onPlaylistPress={() => handleOpenAddToPlaylist(song)}
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

      {/* Hộp thoại thêm bài hát vào danh sách phát */}
      <AddToPlaylistModal
        visible={isAddToPlaylistVisible}
        track={selectedTrackForPlaylist}
        onClose={() => {
          setIsAddToPlaylistVisible(false);
          setSelectedTrackForPlaylist(null);
        }}
        onCreatePlaylistPress={() => {
          setIsAddToPlaylistVisible(false);
          setIsCreateModalVisible(true);
        }}
      />

      {/* Hộp thoại tạo mới danh sách phát */}
      <CreatePlaylistModal
        visible={isCreateModalVisible}
        onClose={() => {
          setIsCreateModalVisible(false);
          setSelectedTrackForPlaylist(null);
        }}
        onCreate={handleCreatePlaylist}
      />
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
