import React, { useState } from "react";
import { StyleSheet, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

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
import { MOCK_ALL_TRACKS } from "@/constants/MockData";
import { Category } from "@/types";

// Danh sách thể loại nhạc giả lập với màu gradient và hình ảnh
const CATEGORIES: Category[] = [
  {
    _id: "c1",
    title: "Pop",
    colors: ["#ff5a14", "#ff8f59"] as [string, string],
    coverUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=150&auto=format&fit=crop",
  },
  {
    _id: "c2",
    title: "Rock",
    colors: ["#4d44b5", "#6b5ce7"] as [string, string],
    coverUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=150&auto=format&fit=crop",
  },
  {
    _id: "c3",
    title: "EDM",
    colors: ["#00e5c9", "#00b39d"] as [string, string],
    coverUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=150&auto=format&fit=crop",
  },
  {
    _id: "c4",
    title: "Jazz",
    colors: ["#ff5a14", "#4d44b5"] as [string, string],
    coverUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=150&auto=format&fit=crop",
  },
  {
    _id: "c5",
    title: "Hip Hop",
    colors: ["#4d44b5", "#00e5c9"] as [string, string],
    coverUrl:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=150&auto=format&fit=crop",
  },
  {
    _id: "c6",
    title: "Indie",
    colors: ["#18181c", "#2c2c35"] as [string, string],
    coverUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=150&auto=format&fit=crop",
  },
];

// Màn hình Tìm kiếm hỗ trợ người dùng lọc tìm các bài hát, ca sĩ, album và khám phá danh mục nhạc
export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Post Malone",
    "Lofi Beats",
    "Midnight City",
    "Daft Punk",
  ]);

  // Hàm xử lý lưu từ khóa mới vào lịch sử tìm kiếm khi người dùng nhấn nút tìm kiếm
  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    const term = searchQuery.trim();
    const filtered = recentSearches.filter((item) => item !== term);
    setRecentSearches([term, ...filtered]);
  };

  // Hàm xóa toàn bộ từ khóa trong lịch sử tìm kiếm gần đây
  const handleClearAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setRecentSearches([]);
  };

  // Hàm điền nhanh từ khóa lịch sử đã chọn lên ô tìm kiếm để thực hiện truy vấn
  const handleSelectRecent = (term: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setSearchQuery(term);
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

  // Lọc danh sách bài hát khớp với từ khóa tìm kiếm của người dùng
  const searchResults = MOCK_ALL_TRACKS.filter((track) => {
    const titleMatch = track.title.toLowerCase().includes(searchQuery.toLowerCase());
    const artistName = typeof track.artist === "string"
      ? track.artist
      : track.artist?.name || "";
    const artistMatch = artistName.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || artistMatch;
  });

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
                results={searchResults}
                searchQuery={searchQuery}
              />
            ) : (
              <>
                {/* Lịch sử tìm kiếm gần đây */}
                {recentSearches.length > 0 && (
                  <RecentSearch
                    recentSearches={recentSearches}
                    handleClearAll={handleClearAll}
                    handleSelectRecent={handleSelectRecent}
                  />
                )}

                {/* Danh mục khám phá thể loại nhạc */}
                <CategoryList
                  categories={CATEGORIES}
                  onSelectCategory={setSelectedCategory}
                />
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
