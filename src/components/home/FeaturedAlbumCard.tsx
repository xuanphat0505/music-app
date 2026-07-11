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
  const [imageError, setImageError] = React.useState(false);
  const defaultCover = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300";
  
  // Nếu có lỗi tải ảnh hoặc không có ảnh bìa, dùng ảnh mặc định và không gán onError để tránh lặp vô hạn
  const useDefault = imageError || !album.artwork || album.artwork.trim() === "";

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <Image
        source={{ uri: useDefault ? defaultCover : album.artwork }}
        style={styles.cover}
        onError={useDefault ? undefined : () => setImageError(true)}
      />
      <Text style={styles.title} numberOfLines={1}>{album.title}</Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {typeof album.artist === "string" ? album.artist : album.artist?.name}
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

