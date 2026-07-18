import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useIsFocused } from "@react-navigation/native";

import { COLORS } from "@/constants/Colors";
import { Header } from "@/components/common";
import {
  CategoryList,
  RecentSearch,
  SearchBar,
  SearchResults,
  CategoryDetail,
  VoiceSearchOverlay,
} from "@/components/search";
import { useSongs, useGenresCount } from "@/hooks/useSongs";
import { useArtists } from "@/hooks/useArtists";
import { useAlbums } from "@/hooks/useAlbums";
import { usePlayerStore } from "@/store/playerStore";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { getGenreStyle } from "@/utils/genre";
import { Category, RecentSearchEntity } from "@/types";

// Màn hình Tìm kiếm hỗ trợ người dùng lọc tìm các bài hát, ca sĩ, album và khám phá danh mục nhạc
export default function SearchScreen() {
  const isFocused = useIsFocused();
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [randomCategories, setRandomCategories] = useState<Category[]>([]);
  const {
    recentSearches,
    saveRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useRecentSearches();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Hàm xử lý lưu từ khóa mới vào lịch sử khi nhấn nút tìm kiếm
  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    const term = searchQuery.trim();
    saveRecentSearch({
      id: `query-${term}`,
      type: "song",
      title: term,
      subtitle: "Search Query",
      imageUrl: "",
      data: null,
    });
  };

  // Hàm xử lý khi nhấn chọn một mục lịch sử tìm kiếm gần đây
  const handleSelectRecent = (item: RecentSearchEntity) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (item.type === "song" && item.data) {
      playTrack(item.data);
    } else {
      setSearchQuery(item.title);
    }
  };

  // Hàm xóa nội dung ô tìm kiếm hiện tại để quay về trạng thái khám phá ban đầu
  const handleClearSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSearchQuery("");
  };

  // Hàm xử lý nhận kết quả từ chức năng tìm kiếm giọng nói giả lập
  const handleVoiceSpeechResult = (result: string) => {
    setIsVoiceActive(false);
    setSearchQuery(result);
  };
  // Lấy danh sách thể loại nhạc động từ cơ sở dữ liệu
  const { genres, isLoading: isGenresLoading } = useGenresCount();

  // Trộn ngẫu nhiên danh mục nhạc và giới hạn hiển thị tối đa 5 phần tử mỗi khi màn hình được truy cập hoặc dữ liệu thay đổi
  useEffect(() => {
    if (isFocused && genres && genres.length > 0) {
      const shuffled = [...genres]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)
        .map((item: { genre: string; count: number }, index: number) => {
          const style = getGenreStyle(item.genre);
          return {
            _id: `g-${index}`,
            title: item.genre,
            colors: style.colors,
            coverUrl: style.coverUrl,
          };
        });
      setRandomCategories(shuffled);
    }
  }, [isFocused, genres]);
  const isSearchActive = searchQuery.trim() !== "";

  // Gọi API lấy kết quả tìm kiếm bài hát theo từ khóa
  const { songs: searchSongs, isLoading: isSongsLoading } = useSongs({
    q: searchQuery,
    enabled: isSearchActive,
  });

  // Gọi API lấy kết quả tìm kiếm nghệ sĩ theo từ khóa
  const { artists: searchArtists, isLoading: isArtistsLoading } = useArtists(
    searchQuery,
    isSearchActive,
  );

  // Gọi API lấy kết quả tìm kiếm album theo từ khóa
  const { albums: searchAlbums, isLoading: isAlbumsLoading } = useAlbums(
    searchQuery,
    isSearchActive,
  );

  const isSearchLoading = isSongsLoading || isArtistsLoading || isAlbumsLoading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {selectedCategory ? (
        <CategoryDetail
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      ) : (
        <>
          <Header />
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Thanh tìm kiếm */}
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearchSubmit={handleSearchSubmit}
              onClear={handleClearSearch}
              onVoicePress={() => setIsVoiceActive(true)}
            />

            {searchQuery ? (
              /* Giao diện hiển thị kết quả tìm kiếm */
              <SearchResults
                songs={searchSongs}
                artists={searchArtists}
                albums={searchAlbums}
                searchQuery={searchQuery}
                isLoading={isSearchLoading}
                onItemSelect={saveRecentSearch}
              />
            ) : (
              <>
                {/* Lịch sử tìm kiếm gần đây */}
                {recentSearches.length > 0 && (
                  <RecentSearch
                    recentSearches={recentSearches}
                    handleClearAll={clearRecentSearches}
                    handleSelectRecent={handleSelectRecent}
                    handleRemoveOne={removeRecentSearch}
                  />
                )}

                {/* Danh mục khám phá thể loại nhạc */}
                {isGenresLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.PRIMARY}
                    style={{ marginTop: 40 }}
                  />
                ) : (
                  <CategoryList
                    categories={randomCategories}
                    onSelectCategory={setSelectedCategory}
                  />
                )}
              </>
            )}
          </ScrollView>
        </>
      )}

      {/* Lớp phủ tìm kiếm bằng giọng nói giả lập */}
      <VoiceSearchOverlay
        visible={isVoiceActive}
        onClose={() => setIsVoiceActive(false)}
        onSpeechResult={handleVoiceSpeechResult}
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
