import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/constants/Colors";
import { Playlist, Track } from "@/types";
import { usePlaylistStore } from "@/store/playlistStore";
import { showSuccess } from "@/utils/toast";
import { formatArtistNames } from "@/utils/artist";

interface AddToPlaylistModalProps {
  visible: boolean;
  track: Track | null;
  onClose: () => void;
  onCreatePlaylistPress: () => void;
}

// Component hộp thoại trượt dưới dạng Bottom Sheet cho phép người dùng thêm bài hát vào danh sách phát
export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  visible,
  track,
  onClose,
  onCreatePlaylistPress,
}) => {
  const playlists = usePlaylistStore((state) => state.playlists);
  const addSongToPlaylist = usePlaylistStore(
    (state) => state.addSongToPlaylist,
  );
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Kích hoạt rung phản hồi khi tương tác
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  // Kiểm tra xem bài hát hiện tại đã tồn tại trong một danh sách phát cụ thể chưa
  const checkIsSongInPlaylist = useCallback(
    (playlist: Playlist): boolean => {
      if (!track || !playlist.songs) return false;
      return playlist.songs.some((item) =>
        typeof item === "string" ? item === track._id : item._id === track._id,
      );
    },
    [track],
  );

  // Thực hiện thêm bài hát vào danh sách phát và gọi callback thông báo
  const executeAddSong = async (playlist: Playlist) => {
    if (!track) return;
    setSubmittingId(playlist._id);
    try {
      const success = await addSongToPlaylist(playlist._id, track);
      if (success) {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => {});
        showSuccess(`Đã thêm vào "${playlist.title}"`);
        onClose();
      }
    } finally {
      setSubmittingId(null);
    }
  };

  // Xử lý khi người dùng chọn một danh sách phát trong danh sách
  const handleSelectPlaylist = (playlist: Playlist) => {
    triggerHaptic();
    const isAlreadyAdded = checkIsSongInPlaylist(playlist);

    if (isAlreadyAdded) {
      Alert.alert(
        "Bài hát đã có sẵn",
        `Bài hát "${track?.title}" đã có trong danh sách phát "${playlist.title}". Bạn vẫn muốn thêm bài hát này?`,
        [
          { text: "Bỏ qua", style: "cancel" },
          {
            text: "Vẫn thêm",
            onPress: () => executeAddSong(playlist),
          },
        ],
      );
    } else {
      executeAddSong(playlist);
    }
  };

  if (!track) return null;

  const coverArt =
    track.artwork ||
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300";

  // Render từng playlist item trong danh sách
  const renderPlaylistItem = ({ item }: { item: Playlist }) => {
    const isAdded = checkIsSongInPlaylist(item);
    const coverUrl =
      item.coverUrls && item.coverUrls.length > 0
        ? item.coverUrls[0]
        : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=100";

    const songCount = item.songs ? item.songs.length : 0;

    return (
      <TouchableOpacity
        style={styles.playlistRow}
        activeOpacity={0.7}
        onPress={() => handleSelectPlaylist(item)}
        disabled={submittingId === item._id}
      >
        <Image source={{ uri: coverUrl }} style={styles.playlistCover} />
        <View style={styles.playlistInfo}>
          <Text style={styles.playlistTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.playlistSub}>
            {item.description || `${songCount} bài hát`}
          </Text>
        </View>
        {isAdded ? (
          <Ionicons name="checkmark-circle" size={22} color="#1db954" />
        ) : (
          <Feather name="plus" size={20} color={COLORS.TEXT_SECONDARY} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <BlurView intensity={90} tint="dark" style={styles.bottomSheet}>
          <View style={styles.handleBar} />

          {/* Header hiển thị thông tin bài hát */}
          <View style={styles.trackHeader}>
            <Image source={{ uri: coverArt }} style={styles.trackCover} />
            <View style={styles.trackDetails}>
              <Text style={styles.addLabel}>THÊM VÀO PLAYLIST</Text>
              <Text style={styles.trackTitle} numberOfLines={1}>
                {track.title}
              </Text>
              <Text style={styles.trackArtist} numberOfLines={1}>
                {formatArtistNames(track.artists)}
              </Text>
            </View>
          </View>

          {/* Nút Tạo mới Playlist */}
          <TouchableOpacity
            style={styles.createButtonRow}
            activeOpacity={0.7}
            onPress={() => {
              triggerHaptic();
              onCreatePlaylistPress();
            }}
          >
            <View style={styles.createIconContainer}>
              <Feather name="plus" size={20} color="#ffffff" />
            </View>
            <Text style={styles.createButtonText}>Danh sách phát mới</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Danh sách các Playlist cá nhân */}
          <FlatList
            data={playlists}
            keyExtractor={(item) => item._id}
            renderItem={renderPlaylistItem}
            showsVerticalScrollIndicator={false}
            style={styles.playlistList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Bạn chưa có danh sách phát nào. Hãy tạo mới ở trên!
                </Text>
              </View>
            }
          />
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  bottomSheet: {
    maxHeight: "75%",
    backgroundColor: "rgba(18, 20, 32, 0.95)",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  trackHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  trackCover: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: COLORS.SURFACE,
  },
  trackDetails: {
    flex: 1,
    justifyContent: "center",
  },
  addLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.PRIMARY,
    fontFamily: "Outfit",
    letterSpacing: 1,
    marginBottom: 2,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  trackArtist: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
  },
  createButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  createIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.GLASS_BORDER,
    marginVertical: 12,
  },
  playlistList: {
    maxHeight: 320,
  },
  playlistRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  playlistCover: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.SURFACE,
  },
  playlistInfo: {
    flex: 1,
    justifyContent: "center",
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  playlistSub: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    textAlign: "center",
  },
});
