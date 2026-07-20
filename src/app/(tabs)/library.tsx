import React, { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "expo-router";
import {
  StyleSheet,
  ScrollView,
  FlatList,
  StatusBar,
  Alert,
  ActivityIndicator,
  RefreshControl,
  View,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";

import { COLORS } from "@/constants/Colors";
import { Header, SongItem, ScrollToTopButton } from "@/components/common";
import {
  CreatePlaylistModal,
  LibraryTabs,
  LibrarySubHeader,
  PlaylistsGrid,
} from "@/components/library";
import { usePlayerStore } from "@/store/playerStore";
import { Playlist, Track } from "@/types";
import { useLibrarySongs } from "@/hooks/useLibrarySongs";
import { formatArtistNames } from "@/utils/artist";

// Danh sách danh sách phát mẫu với ảnh bìa ghép 2x2 chất lượng cao
const MOCK_PLAYLISTS: Playlist[] = [
  {
    _id: "p1",
    title: "Night Drive",
    description: "Curated for You",
    coverUrls: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=100&auto=format&fit=crop",
    ],
  },
  {
    _id: "p2",
    title: "Deep Focus",
    description: "24 Tracks",
    coverUrls: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=100&auto=format&fit=crop",
    ],
  },
];

// Màn hình Thư viện hiển thị danh sách phát cá nhân và các bài hát đã lưu với phân trang vô tận
export default function LibraryScreen() {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [playlists, setPlaylists] = useState<Playlist[]>(MOCK_PLAYLISTS);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"playlists" | "songs">("playlists");

  const flatListRef = useRef<FlatList>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const {
    librarySongs,
    librarySongIds,
    isLoading: isLoadingLibrary,
    isFetchingNextPage,
    hasMore,
    toggleSong,
    refreshLibrary,
    fetchNextPage,
  } = useLibrarySongs();

  // Tự động làm mới danh sách bài hát khi chuyển tới màn hình Library
  useFocusEffect(
    useCallback(() => {
      refreshLibrary();
    }, [refreshLibrary]),
  );

  // Hàm kích hoạt rung phản hồi xúc giác nhẹ khi tương tác
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  // Theo dõi sự kiện cuộn để hiển thị hoặc ẩn nút Scroll to Top
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const isPastThreshold = offsetY > 300;
    if (isPastThreshold !== showScrollTop) {
      setShowScrollTop(isPastThreshold);
    }
  };

  // Xử lý cuộn danh sách bài hát mượt mượt về vị trí đầu tiên
  const handleScrollToTop = () => {
    triggerHaptic();
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Hàm xử lý khi chọn phát một bài hát từ danh sách
  const handlePlaySong = (track: Track) => {
    triggerHaptic();
    playTrack(track);
  };

  // Hàm xử lý xác nhận tạo playlist mới từ hộp thoại modal nhập liệu
  const handleCreatePlaylist = (title: string, desc: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const nextId = playlists.length + 1;
    const mockImagesPool = [
      [
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=100&auto=format&fit=crop",
      ],
      [
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=100&auto=format&fit=crop",
      ],
    ];
    const selectedCoverSet = mockImagesPool[nextId % mockImagesPool.length];

    const newPlaylist: Playlist = {
      _id: `p${Date.now()}`,
      title,
      description: desc || "0 Tracks",
      coverUrls: selectedCoverSet,
    };

    setPlaylists([...playlists, newPlaylist]);
    setIsCreateModalVisible(false);
  };

  // Hàm hiển thị hộp thoại xác nhận khi nhấn giữ để xóa danh sách phát
  const handleLongPressPlaylist = (playlist: Playlist) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Alert.alert("Manage Playlist", `What would you like to do with "${playlist.title}"?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete Playlist",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
          setPlaylists(playlists.filter((p) => p._id !== playlist._id));
        },
      },
    ]);
  };

  // Hàm hiển thị cảnh báo thông tin khi chọn xem chi tiết danh sách phát
  const handleSelectPlaylist = (playlist: Playlist) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Alert.alert("Playlist", `Opening playlist: ${playlist.title}`);
  };

  // Hàm xử lý thêm/bớt bài hát khỏi thư viện cá nhân
  const handleToggleAddSong = (song: Track) => {
    triggerHaptic();
    toggleSong(song);
  };

  // Render từng bài hát trong FlatList
  const renderSongItem = ({ item }: { item: Track }) => (
    <View style={styles.songItemContainer}>
      <SongItem
        song={item}
        subtitle={formatArtistNames(item.artists)}
        duration={item.duration}
        isAdded={librarySongIds.includes(item._id)}
        onPress={() => handlePlaySong(item)}
        onAddPress={() => handleToggleAddSong(item)}
      />
    </View>
  );

  // Render phần Header dùng chung trong FlatList
  const renderHeader = () => (
    <>
      <Header title="Library" />
      <LibraryTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        triggerHaptic={triggerHaptic}
      />
      <LibrarySubHeader
        activeTab={activeTab}
        playlistsCount={playlists.length}
        songsCount={librarySongs.length}
        tracks={librarySongs}
        playTrack={playTrack}
        triggerHaptic={triggerHaptic}
      />
    </>
  );

  // Render Spinner chân danh sách khi đang tải trang tiếp theo
  const renderFooter = () => {
    if (!isFetchingNextPage) return <View style={{ height: 160 }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.PRIMARY} />
      </View>
    );
  };

  // Render giao diện thông báo khi thư viện rỗng
  const renderEmptySongs = () => {
    if (isLoadingLibrary) {
      return (
        <ActivityIndicator
          size="small"
          color={COLORS.PRIMARY}
          style={{ marginTop: 40 }}
        />
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Feather
          name="plus-circle"
          size={44}
          color={COLORS.TEXT_SECONDARY}
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyTitle}>Chưa có bài hát nào</Text>
        <Text style={styles.emptySubtitle}>
          Nhấn biểu tượng + ở bài hát bạn yêu thích để thêm vào Thư viện cá nhân.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {activeTab === "songs" ? (
        <FlatList
          ref={flatListRef}
          data={librarySongs}
          keyExtractor={(item) => item._id}
          renderItem={renderSongItem}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptySongs}
          onEndReached={() => {
            if (hasMore && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingLibrary}
              onRefresh={() => refreshLibrary(true)}
              tintColor={COLORS.PRIMARY}
            />
          }
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingLibrary}
              onRefresh={() => refreshLibrary(true)}
              tintColor={COLORS.PRIMARY}
            />
          }
        >
          {renderHeader()}
          <PlaylistsGrid
            playlists={playlists}
            onSelectPlaylist={handleSelectPlaylist}
            onLongPressPlaylist={handleLongPressPlaylist}
            onAddPlaylistPress={() => setIsCreateModalVisible(true)}
          />
        </ScrollView>
      )}

      {/* Nút cuộn mượt về đầu trang */}
      <ScrollToTopButton
        visible={showScrollTop && activeTab === "songs"}
        onPress={handleScrollToTop}
      />

      {/* Hộp thoại tạo Playlist mới */}
      <CreatePlaylistModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={handleCreatePlaylist}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContainer: {
    paddingBottom: 160,
  },
  songItemContainer: {
    paddingHorizontal: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 160,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    marginTop: 50,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    textAlign: "center",
    lineHeight: 18,
  },
});
