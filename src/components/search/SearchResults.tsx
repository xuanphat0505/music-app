import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { usePlayerStore } from "@/store/playerStore";
import { SongItem } from "@/components/common/SongItem";
import * as Haptics from "expo-haptics";
import { Track, Artist, Playlist, RecentSearchEntity } from "@/types";
import { FilterChips, ArtistResultItem, AlbumResultItem } from "./results";
import { formatArtistNames } from "@/utils/artist";
import { useLibrarySongs } from "@/hooks/useLibrarySongs";
import { usePlaylistStore } from "@/store/playlistStore";
import { AddToPlaylistModal, CreatePlaylistModal } from "@/components/library";
import { showSuccess } from "@/utils/toast";

interface SearchResultsProps {
  songs: Track[];
  artists: Artist[];
  albums: Playlist[];
  searchQuery: string;
  isLoading?: boolean;
  onItemSelect?: (item: RecentSearchEntity) => void;
  onArtistSelect?: (artist: Artist) => void;
}

type TabType = "all" | "songs" | "artists" | "albums";

export const SearchResults: React.FC<SearchResultsProps> = ({
  songs = [],
  artists = [],
  albums = [],
  searchQuery,
  isLoading,
  onItemSelect,
  onArtistSelect,
}) => {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const { isSongInLibrary, toggleSong } = useLibrarySongs();
  const { createPlaylist, addSongToPlaylist } = usePlaylistStore();
  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] = useState<Track | null>(null);
  const [isAddToPlaylistVisible, setIsAddToPlaylistVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  // Xử lý mở hộp thoại thêm bài hát vào danh sách phát
  const handleOpenAddToPlaylist = (track: Track) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSelectedTrackForPlaylist(track);
    setIsAddToPlaylistVisible(true);
  };

  // Xử lý khi xác nhận tạo mới một danh sách phát và lưu bài hát vào đó
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

  // Xử lý khi nhấn phát bài hát
  const handlePlaySong = (track: Track) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    playTrack(track);
    if (onItemSelect) {
      onItemSelect({
        id: track._id,
        type: "song",
        title: track.title,
        subtitle: formatArtistNames(track.artists),
        imageUrl: track.artwork,
        data: track,
      });
    }
  };

  // Xử lý thêm/bớt bài hát vào thư viện cá nhân
  const handleToggleLibrary = (song: Track) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    toggleSong(song);
  };

  // Xử lý khi nhấn chọn nghệ sĩ
  const handleSelectArtist = (artist: Artist) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onItemSelect) {
      onItemSelect({
        id: artist._id,
        type: "artist",
        title: artist.name,
        subtitle: "Artist",
        imageUrl: artist.avatar,
        data: artist,
      });
    }
    if (onArtistSelect) {
      onArtistSelect(artist);
    }
  };

  // Xử lý khi nhấn chọn album
  const handleSelectAlbum = (album: Playlist) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const artistName = typeof album.artist === "string" ? album.artist : album.artist?.name;
    if (onItemSelect) {
      onItemSelect({
        id: album._id,
        type: "album",
        title: album.title,
        subtitle: `Album • ${artistName || "Unknown Artist"}`,
        imageUrl: album.artwork || album.coverUrls?.[0] || "",
        data: album,
      });
    }
    Alert.alert("Album Page", `Truy cập album ${album.title}`);
  };

  const handleTabPress = (tab: TabType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setActiveTab(tab);
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Searching MusicHub...</Text>
      </View>
    );
  }

  const hasNoResults = songs.length === 0 && artists.length === 0 && albums.length === 0;

  if (hasNoResults) {
    return (
      <View style={styles.noResultsContainer}>
        <Feather name="search" size={48} color={COLORS.TEXT_SECONDARY} style={styles.noResultsIcon} />
        <Text style={styles.noResultsTitle}>No results found</Text>
        <Text style={styles.noResultsSubtitle}>
          {`We couldn't find any songs, artists, or albums matching "${searchQuery}"`}
        </Text>
      </View>
    );
  }

  // Render tab "All" hiển thị tóm tắt các kết quả
  const renderAllTab = () => {
    return (
      <View style={styles.tabContent}>
        {/* Phần bài hát (Top Songs) */}
        {songs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Songs</Text>
              {songs.length > 3 && (
                <TouchableOpacity onPress={() => handleTabPress("songs")} style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.songsList}>
              {songs.slice(0, 3).map((song) => (
                <SongItem
                  key={song._id}
                  song={song}
                  onPress={() => handlePlaySong(song)}
                  duration={song.duration}
                  isAdded={isSongInLibrary(song._id)}
                  onAddPress={() => handleToggleLibrary(song)}
                  onPlaylistPress={() => handleOpenAddToPlaylist(song)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Phần nghệ sĩ (Artists) */}
        {artists.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Artists</Text>
              {artists.length > 4 && (
                <TouchableOpacity onPress={() => handleTabPress("artists")} style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {artists.slice(0, 6).map((artist) => (
                <ArtistResultItem
                  key={artist._id}
                  artist={artist}
                  variant="horizontal"
                  onPress={() => handleSelectArtist(artist)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Phần album nhạc (Albums) */}
        {albums.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Albums</Text>
              {albums.length > 3 && (
                <TouchableOpacity onPress={() => handleTabPress("albums")} style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {albums.slice(0, 6).map((album) => (
                <AlbumResultItem
                  key={album._id}
                  album={album}
                  variant="horizontal"
                  onPress={() => handleSelectAlbum(album)}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  // Render tab danh sách toàn bộ bài hát
  const renderSongsTab = () => {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.resultsCountText}>{songs.length} songs found</Text>
        <View style={styles.verticalList}>
          {songs.map((song) => (
            <SongItem
              key={song._id}
              song={song}
              onPress={() => handlePlaySong(song)}
              duration={song.duration}
              isAdded={isSongInLibrary(song._id)}
              onAddPress={() => handleToggleLibrary(song)}
              onPlaylistPress={() => handleOpenAddToPlaylist(song)}
            />
          ))}
        </View>
      </View>
    );
  };

  // Render tab danh sách toàn bộ ca sĩ
  const renderArtistsTab = () => {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.resultsCountText}>{artists.length} artists found</Text>
        <View style={styles.verticalList}>
          {artists.map((artist) => (
            <ArtistResultItem
              key={artist._id}
              artist={artist}
              variant="vertical"
              onPress={() => handleSelectArtist(artist)}
            />
          ))}
        </View>
      </View>
    );
  };

  // Render tab danh sách toàn bộ album nhạc
  const renderAlbumsTab = () => {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.resultsCountText}>{albums.length} albums found</Text>
        <View style={styles.verticalList}>
          {albums.map((album) => (
            <AlbumResultItem
              key={album._id}
              album={album}
              variant="vertical"
              onPress={() => handleSelectAlbum(album)}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FilterChips
        activeTab={activeTab}
        onTabPress={handleTabPress}
        hasSongs={songs.length > 0}
        hasArtists={artists.length > 0}
        hasAlbums={albums.length > 0}
      />

      {activeTab === "all" && renderAllTab()}
      {activeTab === "songs" && renderSongsTab()}
      {activeTab === "artists" && renderArtistsTab()}
      {activeTab === "albums" && renderAlbumsTab()}

      {/* Hộp thoại hiển thị danh sách các Playlist để người dùng lưu vào */}
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

      {/* Hộp thoại điền thông tin để tạo mới một Playlist */}
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
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    gap: 12,
  },
  loadingText: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    fontSize: 13,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    marginTop: 60,
  },
  noResultsIcon: {
    marginBottom: 16,
    opacity: 0.8,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    textAlign: "center",
    lineHeight: 20,
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeAllText: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontFamily: "Inter",
    fontWeight: "600",
  },
  songsList: {
    gap: 2,
  },
  horizontalScroll: {
    paddingRight: 16,
    paddingVertical: 4,
  },
  verticalList: {
    gap: 8,
    paddingBottom: 24,
  },
  resultsCountText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    marginBottom: 16,
  },
});
