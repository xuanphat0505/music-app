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
import { Track, Artist, Album, RecentSearchEntity } from "@/types";
import { FilterChips, ArtistResultItem, AlbumResultItem } from "./results";

interface SearchResultsProps {
  songs: Track[];
  artists: Artist[];
  albums: Album[];
  searchQuery: string;
  isLoading?: boolean;
  onItemSelect?: (item: RecentSearchEntity) => void;
}

type TabType = "all" | "songs" | "artists" | "albums";

export const SearchResults: React.FC<SearchResultsProps> = ({
  songs = [],
  artists = [],
  albums = [],
  searchQuery,
  isLoading,
  onItemSelect,
}) => {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [activeTab, setActiveTab] = useState<TabType>("all");

  // Xử lý khi nhấn phát bài hát
  const handlePlaySong = (track: Track) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    playTrack(track);
    if (onItemSelect) {
      onItemSelect({
        id: track._id,
        type: "song",
        title: track.title,
        subtitle:
          typeof track.artist === "string" ? track.artist : track.artist?.name || "Unknown Artist",
        imageUrl: track.artwork,
        data: track,
      });
    }
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
    Alert.alert("Artist Page", `Truy cập ca sĩ ${artist.name}`);
  };

  // Xử lý khi nhấn chọn album
  const handleSelectAlbum = (album: Album) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const artistName = typeof album.artist === "string" ? album.artist : album.artist?.name;
    if (onItemSelect) {
      onItemSelect({
        id: album._id,
        type: "album",
        title: album.title,
        subtitle: `Album • ${artistName || "Unknown Artist"}`,
        imageUrl: album.artwork,
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
                  onAddPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    Alert.alert(
                      "Add to Playlist",
                      `Thêm "${song.title}" vào danh sách phát. Chức năng đang được phát triển.`
                    );
                  }}
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
              onAddPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                Alert.alert(
                  "Add to Playlist",
                  `Thêm "${song.title}" vào danh sách phát. Chức năng đang được phát triển.`
                );
              }}
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
