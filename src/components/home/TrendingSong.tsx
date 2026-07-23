import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SongItem } from "../common";
import { usePlayerStore } from "@/store/playerStore";
import { Track } from "@/types";
import * as Haptics from "expo-haptics";
import { formatArtistNames } from "@/utils/artist";
import { useLibrarySongs } from "@/hooks/useLibrarySongs";
import { usePlaylistStore } from "@/store/playlistStore";
import { AddToPlaylistModal, CreatePlaylistModal } from "@/components/library";
import { showSuccess } from "@/utils/toast";
import { formatPlays } from "@/utils/format";

interface TrendingSongProps {
  song: Track;
}

// Component dòng hiển thị bài hát xu hướng cho phép phát nhanh, lưu thư viện và thêm vào playlist
export const TrendingSong: React.FC<TrendingSongProps> = React.memo(({ song }) => {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const { isSongInLibrary, toggleSong } = useLibrarySongs();
  const { createPlaylist, addSongToPlaylist } = usePlaylistStore();

  const [isAddToPlaylistVisible, setIsAddToPlaylistVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const artistName = formatArtistNames(song.artists);
  const totalPlays = (song.playsCount || 0) + (song.spotifyPlaysCount || 0);
  const playsText = formatPlays(totalPlays);

  // Xử lý tạo mới danh sách phát từ modal và thêm bài hát hiện tại vào playlist đó
  const handleCreatePlaylist = async (title: string, desc: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const created = await createPlaylist(title, desc);
    setIsCreateModalVisible(false);
    if (created) {
      await addSongToPlaylist(created._id, song);
      showSuccess(`Đã tạo và thêm vào "${created.title}"`);
    }
  };

  return (
    <>
      <SongItem
        song={song}
        subtitle={`${artistName} • ${playsText} plays`}
        duration={song.duration}
        style={styles.rowMargin}
        isAdded={isSongInLibrary(song._id)}
        onPress={() => playTrack(song)}
        onAddPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          toggleSong(song);
        }}
        onPlaylistPress={() => setIsAddToPlaylistVisible(true)}
      />

      {/* Modal hiển thị danh sách playlist của người dùng để chọn thêm vào */}
      <AddToPlaylistModal
        visible={isAddToPlaylistVisible}
        track={song}
        onClose={() => setIsAddToPlaylistVisible(false)}
        onCreatePlaylistPress={() => {
          setIsAddToPlaylistVisible(false);
          setIsCreateModalVisible(true);
        }}
      />

      {/* Modal điền thông tin để người dùng tạo mới danh sách phát */}
      <CreatePlaylistModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={handleCreatePlaylist}
      />
    </>
  );
});

TrendingSong.displayName = "TrendingSong";

const styles = StyleSheet.create({
  rowMargin: {
    marginHorizontal: 20,
  },
});

export default TrendingSong;
