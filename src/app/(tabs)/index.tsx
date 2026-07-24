import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";

import { COLORS } from "@/constants/Colors";
import { Header } from "@/components/common";
import {
  FeaturedAlbumCard,
  TrendingSong,
  WelcomeSection,
} from "@/components/home";
import { useTrendingSongs } from "@/hooks/useSongs";
import { useAlbums } from "@/hooks/useAlbums";
import { usePlaylistStore } from "@/store/playlistStore";

// Giao diện chính của màn hình trang Home hiển thị các album và bài hát được cá nhân hóa
export default function HomeScreen() {
  const { songs, isLoading: isLoadingSongs } = useTrendingSongs(10);
  const { albums, isLoading: isLoadingAlbums } = useAlbums();
  const { playlists, fetchPlaylists } = usePlaylistStore();
  const isFocused = useIsFocused();

  // Gọi tải danh sách phát khi màn hình được truy cập (focus)
  useEffect(() => {
    if (isFocused) {
      fetchPlaylists().catch(() => {});
    }
  }, [isFocused, fetchPlaylists]);

  // Trộn lẫn hiển thị cả Playlists của người dùng cùng với các Albums hệ thống
  const combinedItems = React.useMemo(() => {
    return [...playlists, ...albums];
  }, [playlists, albums]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        {/* Phần chào hỏi người dùng */}
        <WelcomeSection />

        {/* Phần danh sách phát cho bạn */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Playlists for You</Text>
        </View>

        {isLoadingAlbums ? (
          <ActivityIndicator size="small" color={COLORS.PRIMARY} style={{ marginVertical: 20 }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {combinedItems.map((item) => {
              const isAlbum = 'artwork' in item;
              const uniqueKey = `${isAlbum ? 'album' : 'playlist'}-${item._id}`;
              return (
                <FeaturedAlbumCard key={uniqueKey} item={item} />
              );
            })}
          </ScrollView>
        )}

        {/* Phần bài hát đang thịnh hành */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Today</Text>
        </View>

        {isLoadingSongs ? (
          <ActivityIndicator size="small" color={COLORS.PRIMARY} style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.songsList}>
            {songs.map((song) => (
              <TrendingSong key={song._id} song={song} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContainer: {
    paddingBottom: 160, // Tạo khoảng trống để không bị MiniPlayer đè lên nội dung
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  seeAllButton: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.PRIMARY,
    fontFamily: "Inter",
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 4,
    marginBottom: 24,
  },
  songsList: {
    marginBottom: 10,
  },
});
