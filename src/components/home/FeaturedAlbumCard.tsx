import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { Album } from '@/types';

interface FeaturedAlbumCardProps {
  album: Album;
  onPress?: () => void;
}

// Thẻ hiển thị Album/Playlist nổi bật cuộn ngang trong danh sách phát
export const FeaturedAlbumCard: React.FC<FeaturedAlbumCardProps> = ({ album, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <Image source={{ uri: album.coverUrl }} style={styles.cover} />
      <Text style={styles.title} numberOfLines={1}>{album.title}</Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {album.artist}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    marginRight: 16,
  },
  cover: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: COLORS.SURFACE,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Outfit',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'Inter',
  },
});
export default FeaturedAlbumCard;

