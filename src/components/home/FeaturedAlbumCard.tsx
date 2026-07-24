import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { Playlist } from '@/types';

interface FeaturedAlbumCardProps {
  item: Playlist;
  onPress?: () => void;
}

// Thẻ hiển thị Album/Playlist nổi bật cuộn ngang trong danh sách phát
// Sử dụng React.memo để tránh re-render không cần thiết khi store thay đổi
export const FeaturedAlbumCard: React.FC<FeaturedAlbumCardProps> = React.memo(({ item, onPress }) => {
  const [imageError, setImageError] = React.useState(false);
  const defaultCover = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300";
  
  // Trích xuất ảnh bìa phù hợp từ Playlist hợp nhất
  const coverUri = item.artwork 
    ? item.artwork 
    : (item.coverUrls && item.coverUrls.length > 0 ? item.coverUrls[0] : "");

  // Nếu có lỗi tải ảnh hoặc không có ảnh bìa, dùng ảnh mặc định
  const useDefault = imageError || !coverUri || coverUri.trim() === "";

  // Lấy chuỗi mô tả phụ đề (Tên nghệ sĩ cho Album, mô tả hoặc số bài hát cho Playlist)
  const getSubtitle = () => {
    if (item.artist) {
      const artist = item.artist;
      return typeof artist === "string" ? artist : artist?.name || "Unknown Artist";
    } else {
      return item.description || `${item.songs?.length || 0} bài hát`;
    }
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <Image
        source={{ uri: useDefault ? defaultCover : coverUri }}
        style={styles.cover}
        onError={useDefault ? undefined : () => setImageError(true)}
      />
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {getSubtitle()}
      </Text>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Chỉ render lại nếu item thay đổi
  return prevProps.item._id === nextProps.item._id &&
    prevProps.item.title === nextProps.item.title &&
    prevProps.item.artwork === nextProps.item.artwork &&
    prevProps.item.coverUrls?.[0] === nextProps.item.coverUrls?.[0];
});

FeaturedAlbumCard.displayName = 'FeaturedAlbumCard';

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

