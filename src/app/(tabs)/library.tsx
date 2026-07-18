import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { COLORS } from "@/constants/Colors";
import { Header } from "@/components/common";
import {
  CreatePlaylistModal,
  LibraryTabs,
  LibrarySubHeader,
  PlaylistsGrid,
  SongsList,
} from "@/components/library";
import { usePlayerStore } from "@/store/playerStore";
import { Playlist, Track } from "@/types";
import { useSongs } from "@/hooks/useSongs";

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

// Màn hình Thư viện hiển thị danh sách phát cá nhân và các bài hát được phát gần đây
export default function LibraryScreen() {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [playlists, setPlaylists] = useState<Playlist[]>(MOCK_PLAYLISTS);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"playlists" | "songs">(
    "playlists",
  );
  const [addedSongs, setAddedSongs] = useState<string[]>(["s1", "s3", "s5"]);
  const { songs: allTracks, isLoading: isLoadingSongs } = useSongs({});

  // Hàm kích hoạt rung phản hồi xúc giác nhẹ khi tương tác
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  // Hàm xử lý khi chọn phát một bài hát từ danh sách
  const handlePlaySong = (track: Track) => {
    triggerHaptic();
    playTrack(track);
  };

  // Hàm xử lý xác nhận tạo playlist mới từ hộp thoại modal nhập liệu
  const handleCreatePlaylist = (title: string, desc: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
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
    Alert.alert(
      "Manage Playlist",
      `What would you like to do with "${playlist.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete Playlist",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning,
            ).catch(() => {});
            setPlaylists(playlists.filter((p) => p._id !== playlist._id));
          },
        },
      ],
    );
  };

  // Hàm hiển thị cảnh báo thông tin khi chọn xem chi tiết danh sách phát
  const handleSelectPlaylist = (playlist: Playlist) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Alert.alert("Playlist", `Opening playlist: ${playlist.title}`);
  };

  // Hàm xử lý thêm/bớt bài hát khỏi danh sách phát (toggle like)
  const handleToggleAddSong = (song: Track) => {
    triggerHaptic();
    const songId = song._id;
    if (addedSongs.includes(songId)) {
      setAddedSongs(addedSongs.filter((id) => id !== songId));
    } else {
      setAddedSongs([...addedSongs, songId]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Thanh tiêu đề tùy chỉnh */}
      <Header title="Library" />

      {/* Bộ điều khiển chuyển đổi giữa danh sách phát và danh sách bài hát */}
      <LibraryTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        triggerHaptic={triggerHaptic}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Phần thông tin chi tiết đầu danh mục (Sub-header) */}
        <LibrarySubHeader
          activeTab={activeTab}
          playlistsCount={playlists.length}
          songsCount={allTracks.length}
          tracks={allTracks}
          playTrack={playTrack}
          triggerHaptic={triggerHaptic}
        />

        {/* Nội dung danh sách theo Tab đang hoạt động */}
        {activeTab === "playlists" ? (
          <PlaylistsGrid
            playlists={playlists}
            onSelectPlaylist={handleSelectPlaylist}
            onLongPressPlaylist={handleLongPressPlaylist}
            onAddPlaylistPress={() => setIsCreateModalVisible(true)}
          />
        ) : isLoadingSongs ? (
          <ActivityIndicator size="small" color={COLORS.PRIMARY} style={{ marginTop: 40 }} />
        ) : (
          <SongsList
            songs={allTracks}
            addedSongs={addedSongs}
            onPlaySong={handlePlaySong}
            onToggleAddSong={handleToggleAddSong}
          />
        )}
      </ScrollView>

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
});
