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
  AddToPlaylistModal,
  LibraryTabs,
  LibrarySubHeader,
  PlaylistsGrid,
} from "@/components/library";
import { usePlayerStore } from "@/store/playerStore";
import { usePlaylistStore } from "@/store/playlistStore";
import { Playlist, Track } from "@/types";
import { useLibrarySongs } from "@/hooks/useLibrarySongs";
import { showSuccess } from "@/utils/toast";
import { formatArtistNames } from "@/utils/artist";

// Màn hình Thư viện hiển thị danh sách phát cá nhân và các bài hát đã lưu với phân trang vô tận
export default function LibraryScreen() {
  const playTrack = usePlayerStore((state) => state.playTrack);

  const {
    playlists,
    fetchPlaylists,
    createPlaylist,
    deletePlaylist,
    addSongToPlaylist,
  } = usePlaylistStore();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"playlists" | "songs">("playlists");

  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] =
    useState<Track | null>(null);
  const [isAddToPlaylistVisible, setIsAddToPlaylistVisible] = useState(false);

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

  // Tự động làm mới danh sách phát và danh sách bài hát khi chuyển tới màn hình Library
  useFocusEffect(
    useCallback(() => {
      refreshLibrary();
      fetchPlaylists();
    }, [refreshLibrary, fetchPlaylists]),
  );

  // Kích hoạt rung phản hồi xúc giác nhẹ khi tương tác
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  // Mở modal thêm bài hát vào danh sách phát
  const handleOpenAddToPlaylist = (track: Track) => {
    triggerHaptic();
    setSelectedTrackForPlaylist(track);
    setIsAddToPlaylistVisible(true);
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

  // Xử lý khi chọn phát một bài hát từ danh sách
  const handlePlaySong = (track: Track) => {
    triggerHaptic();
    playTrack(track);
  };

  // Xử lý xác nhận tạo danh sách phát mới từ hộp thoại nhập liệu đồng thời tự động lưu bài hát (nếu có)
  const handleCreatePlaylist = async (title: string, desc: string) => {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success,
    ).catch(() => {});
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

  // Hiển thị hộp thoại xác nhận khi nhấn giữ để xóa danh sách phát
  const handleLongPressPlaylist = (playlist: Playlist) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Alert.alert(
      "Quản lý danh sách phát",
      `Bạn có muốn xóa danh sách phát "${playlist.title}" không?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa danh sách phát",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning,
            ).catch(() => {});
            const success = await deletePlaylist(playlist._id);
            if (success) {
              showSuccess(`Đã xóa danh sách phát "${playlist.title}"`);
            }
          },
        },
      ],
    );
  };

  // Hiển thị cảnh báo thông tin khi chọn xem chi tiết danh sách phát
  const handleSelectPlaylist = (playlist: Playlist) => {
    triggerHaptic();
    Alert.alert("Danh sách phát", `Xem danh sách phát: ${playlist.title}`);
  };

  // Xử lý thêm/bớt bài hát khỏi thư viện cá nhân
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
        onPlaylistPress={() => handleOpenAddToPlaylist(item)}
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
              onRefresh={() => {
                refreshLibrary(true);
                fetchPlaylists();
              }}
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
              onRefresh={() => {
                refreshLibrary(true);
                fetchPlaylists();
              }}
              tintColor={COLORS.PRIMARY}
            />
          }
        >
          {renderHeader()}
          <PlaylistsGrid
            playlists={playlists}
            onSelectPlaylist={handleSelectPlaylist}
            onLongPressPlaylist={handleLongPressPlaylist}
            onAddPlaylistPress={() => {
              setSelectedTrackForPlaylist(null);
              setIsCreateModalVisible(true);
            }}
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
        onClose={() => {
          setIsCreateModalVisible(false);
          setSelectedTrackForPlaylist(null);
        }}
        onCreate={handleCreatePlaylist}
      />

      {/* Hộp thoại Bottom Sheet chọn danh sách phát để thêm bài hát */}
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
