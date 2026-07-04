import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/Colors";
import { Header } from "@/components/common";
import {
  FeaturedAlbumCard,
  TrendingSong,
  WelcomeSection,
  RecentPlayGrid,
} from "@/components/home";
import { Track } from "@/types";

// Danh sách dữ liệu giả lập cho Album nổi bật hiển thị cuộn ngang trên trang chủ
const MOCK_ALBUMS = [
  {
    id: "a1",
    title: "Neon Nights",
    artist: "various Artists",
    genre: "Electronic",
    coverUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "a2",
    title: "Cyber Echoes",
    artist: "LUN",
    genre: "Synthwave",
    coverUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "a3",
    title: "Digital Odyssey",
    artist: "RetroFuture",
    genre: "EDM",
    coverUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop",
  },
];

// Danh sách dữ liệu giả lập cho các bài hát thịnh hành hôm nay hiển thị cuộn dọc
const MOCK_SONGS: (Track & { plays: string })[] = [
  {
    id: "s1",
    title: "Velocity",
    artist: "Pulse Engine",
    coverUrl:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=150&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 372,
    plays: "2.4M",
  },
  {
    id: "s2",
    title: "Midnight Blue",
    artist: "Azure Dreams",
    coverUrl:
      "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=150&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 423,
    plays: "1.8M",
  },
  {
    id: "s3",
    title: "Fractured",
    artist: "Digital Void",
    coverUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=150&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 344,
    plays: "3.1M",
  },
  {
    id: "s4",
    title: "Starlight Drift",
    artist: "Orion",
    coverUrl:
      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=150&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: 302,
    plays: "1.2M",
  },
];

// Giao diện chính của màn hình trang Home hiển thị các album và bài hát được cá nhân hóa
export default function HomeScreen() {
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

        {/* Lưới phát nhạc nhanh */}
        <RecentPlayGrid />

        {/* Phần Album nổi bật */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Albums</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllButton}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {MOCK_ALBUMS.map((album) => (
            <FeaturedAlbumCard key={album.id} album={album} />
          ))}
        </ScrollView>

        {/* Phần bài hát đang thịnh hành */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Today</Text>
        </View>
        <View style={styles.songsList}>
          {MOCK_SONGS.map((song) => (
            <TrendingSong key={song.id} song={song} plays={song.plays} />
          ))}
        </View>
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
