import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/constants/Colors";
import { useArtistDetail, useArtistSongs } from "@/hooks/useArtists";
import { useLibrarySongs } from "@/hooks/useLibrarySongs";
import { usePlayerStore } from "@/store/playerStore";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
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
  const {
    artist: detail,
    isLoading: isDetailLoading,
    refetch: refetchDetail,
  } = useArtistDetail(artist._id);

  // Tải danh sách bài hát của nghệ sĩ từ server hỗ trợ phân trang
  const {
    songs,
    isLoading: isSongsLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    refresh: refreshSongs,
  } = useArtistSongs(artist._id);

  const displayArtist = detail || artist;
  const followerCount = displayArtist.followerCount || 0;

  // Hook hỗ trợ kéo xuống làm mới thông tin và bài hát nghệ sĩ
  const { refreshControl } = usePullToRefresh(async () => {
    await Promise.all([refetchDetail(), refreshSongs()]);
  });

  // Tự động tải thêm bài hát khi người dùng cuộn đến gần cuối danh sách
  const handleEndReached = () => {
    if (songs.length > 0 && !isSongsLoading && !isLoadingMore && hasMore) {
      loadMore();
    }
  };

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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    setIsFollowing(!isFollowing);
  };

  // Xử lý thêm bớt bài hát của nghệ sĩ vào thư viện cá nhân
  const handleToggleLibrary = (song: Track) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    toggleSong(song);
  };

  // Phần đầu danh sách chứa ảnh đại diện thông tin và tiểu sử nghệ sĩ
  const renderHeader = () => (
    <View>
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
              <Feather
                name="user"
                size={48}
                color="rgba(255, 255, 255, 0.3)"
              />
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

      {/* Tiêu đề danh sách bài hát */}
      <View style={styles.songsHeaderSection}>
        <Text style={styles.sectionTitle}>Bài hát nổi bật</Text>
      </View>
    </View>
  );

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

      {isDetailLoading && songs.length === 0 ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <View style={styles.songItemWrapper}>
              <SongItem
                song={item}
                subtitle={formatArtistNames(item.artists)}
                duration={item.duration}
                isAdded={isSongInLibrary(item._id)}
                onPress={() => handlePlaySong(item)}
                onAddPress={() => handleToggleLibrary(item)}
              />
            </View>
          )}
          ListEmptyComponent={
            isSongsLoading ? (
              <ActivityIndicator
                size="small"
                color={COLORS.PRIMARY}
                style={{ marginVertical: 32 }}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Nghệ sĩ chưa có bài hát nào được cập nhật
                </Text>
              </View>
            )
          }
          ListFooterComponent={
            songs.length > 0 && isLoadingMore ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color={COLORS.PRIMARY} />
              </View>
            ) : null
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        />
      )}
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
  songsHeaderSection: {
    paddingHorizontal: 20,
  },
  songItemWrapper: {
    paddingHorizontal: 20,
  },
  centerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLoading: {
    paddingVertical: 16,
    alignItems: "center",
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
