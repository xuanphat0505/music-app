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
import { useArtistDetail, useArtistSongs } from "@/hooks/useArtists";
import { useLibrarySongs } from "@/hooks/useLibrarySongs";
import { usePlayerStore } from "@/store/playerStore";
import { SongItem } from "@/components/common";
import { Artist, Track } from "@/types";
import { formatArtistNames } from "@/utils/artist";

interface ArtistDetailProps {
  artist: Artist;
  onBack: () => void;
}

// Component hiển thị thông tin chi tiết nghệ sĩ gồm ảnh đại diện tiểu sử số lượt theo dõi và danh sách bài hát
export const ArtistDetail: React.FC<ArtistDetailProps> = ({
  artist,
  onBack,
}) => {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [isFollowing, setIsFollowing] = useState(false);
  const { isSongInLibrary, toggleSong } = useLibrarySongs();

  // Tải chi tiết nghệ sĩ nâng cao từ server
  const { artist: detail, isLoading: isDetailLoading } = useArtistDetail(artist._id);

  // Tải danh sách bài hát của nghệ sĩ từ server
  const { songs, isLoading: isSongsLoading } = useArtistSongs(artist._id);

  const displayArtist = detail || artist;
  const followerCount = displayArtist.followerCount || 0;

  // Xử lý khi nhấn phát nhạc và rung phản hồi nhẹ
  const handlePlaySong = (track: Track) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    playTrack(track);
  };

  // Xử lý phát tất cả danh sách bài hát của nghệ sĩ dưới dạng hàng đợi
  const handlePlayAll = () => {
    if (songs.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    playTrack(songs[0]);
  };

  // Xử lý bật tắt theo dõi nghệ sĩ kèm rung phản hồi
  const handleFollowToggle = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setIsFollowing(!isFollowing);
  };

  // Xử lý thêm bớt bài hát của nghệ sĩ vào thư viện cá nhân
  const handleToggleLibrary = (song: Track) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    toggleSong(song);
  };

  const isLoading = isDetailLoading || isSongsLoading;

  return (
    <View style={styles.container}>
      {/* Tiêu đề thanh tác vụ trên cùng */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {displayArtist.name}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Biểu ngữ nghệ sĩ dạng gradient sang trọng */}
        <LinearGradient
          colors={["rgba(16, 185, 129, 0.2)", "rgba(9, 9, 11, 0)"]}
          style={styles.banner}
        >
          <View style={styles.profileContainer}>
            {displayArtist.avatar ? (
              <Image
                source={{ uri: displayArtist.avatar }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
                <Feather name="user" size={48} color="rgba(255, 255, 255, 0.3)" />
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.artistName} numberOfLines={2}>
                {displayArtist.name}
              </Text>
              <Text style={styles.followerText}>
                {followerCount.toLocaleString()} người theo dõi
              </Text>
            </View>
          </View>

          {/* Hàng nút chức năng tương tác */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={handleFollowToggle}
              activeOpacity={0.8}
              style={[
                styles.followButton,
                isFollowing && styles.followingButton,
              ]}
            >
              <Text
                style={[
                  styles.followButtonText,
                  isFollowing && styles.followingButtonText,
                ]}
              >
                {isFollowing ? "Đang theo dõi" : "Theo dõi"}
              </Text>
            </TouchableOpacity>

            {songs.length > 0 && (
              <TouchableOpacity
                onPress={handlePlayAll}
                activeOpacity={0.8}
                style={styles.playAllButton}
              >
                <Feather name="play" size={20} color="#FFFFFF" />
                <Text style={styles.playAllText}>Phát tất cả</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* Tiểu sử giới thiệu nghệ sĩ */}
        {displayArtist.bio && (
          <View style={styles.bioSection}>
            <Text style={styles.sectionTitle}>Giới thiệu</Text>
            <View style={styles.bioCard}>
              <Text style={styles.bioText}>{displayArtist.bio}</Text>
            </View>
          </View>
        )}

        {/* Danh sách các bài hát nổi bật */}
        <View style={styles.songsSection}>
          <Text style={styles.sectionTitle}>Bài hát nổi bật</Text>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={COLORS.PRIMARY}
              style={{ marginVertical: 32 }}
            />
          ) : songs.length > 0 ? (
            <View style={styles.songsList}>
              {songs.map((song) => (
                <SongItem
                  key={song._id}
                  song={song}
                  subtitle={formatArtistNames(song.artists)}
                  duration={song.duration}
                  isAdded={isSongInLibrary(song._id)}
                  onPress={() => handlePlaySong(song)}
                  onAddPress={() => handleToggleLibrary(song)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nghệ sĩ chưa có bài hát nào được cập nhật
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  banner: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY,
  },
  avatarPlaceholder: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  artistName: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 6,
    lineHeight: 32,
  },
  followerText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  followButton: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  followingButton: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  followButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter",
  },
  followingButtonText: {
    color: COLORS.TEXT_SECONDARY,
  },
  playAllButton: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  playAllText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter",
  },
  bioSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 12,
  },
  bioCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  bioText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Inter",
  },
  songsSection: {
    paddingHorizontal: 20,
  },
  songsList: {
    gap: 2,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    fontSize: 14,
  },
});

export default ArtistDetail;
