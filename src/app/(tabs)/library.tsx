import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/Colors';
import { GlassView } from '@/components/common';

// Màn hình Thư viện hiển thị danh sách các bài hát yêu thích và danh sách phát cá nhân
export default function LibraryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Library</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <GlassView style={styles.card}>
          <Text style={styles.cardTitle}>Liked Songs</Text>
          <Text style={styles.cardSubtitle}>0 tracks</Text>
        </GlassView>
        <GlassView style={styles.card}>
          <Text style={styles.cardTitle}>My Playlists</Text>
          <Text style={styles.cardSubtitle}>Create your first playlist</Text>
        </GlassView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Outfit',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    padding: 16,
    height: 100,
    justifyContent: 'flex-end',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Outfit',
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'Inter',
    marginTop: 2,
  },
});
