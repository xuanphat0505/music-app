import React from 'react';
import { PlaylistCard } from '../common/PlaylistCard';
import { Playlist } from '@/types';

interface FeaturedAlbumCardProps {
  item: Playlist;
  onPress?: () => void;
}

// Thẻ hiển thị Album/Playlist nổi bật được bọc và tái sử dụng từ PlaylistCard dùng chung
export const FeaturedAlbumCard: React.FC<FeaturedAlbumCardProps> = React.memo(({ item, onPress }) => {
  return (
    <PlaylistCard
      playlist={item}
      onPress={onPress || (() => {})}
    />
  );
});

FeaturedAlbumCard.displayName = 'FeaturedAlbumCard';

export default FeaturedAlbumCard;

