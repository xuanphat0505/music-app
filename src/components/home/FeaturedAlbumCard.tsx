import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '@/constants/Colors';

interface Album {
  id: string;
  title: string;
  artist: string;
  genre: string;
  coverUrl: string;
}

interface FeaturedAlbumCardProps {
  album: Album;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.65;


export const FeaturedAlbumCard: React.FC<FeaturedAlbumCardProps> = ({ album, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
      <Image source={{ uri: album.coverUrl }} style={styles.cover} />
      <Text style={styles.title} numberOfLines={1}>{album.title}</Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {album.genre} • {album.artist}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginRight: 16,
  },
  cover: {
    width: '100%',
    height: cardWidth,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: COLORS.SURFACE,
  },
  title: {
    fontSize: 16,
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
