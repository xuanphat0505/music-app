import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS } from '@/constants/Colors';

interface GlassViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

// Hợp phần tạo hiệu ứng nền kính mờ giúp giao diện có chiều sâu và nổi bật các nội dung phía trên
export const GlassView: React.FC<GlassViewProps> = ({ children, style }) => {
  return (
    <BlurView intensity={25} tint="dark" style={[styles.container, style]}>
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
    backgroundColor: COLORS.GLASS_FILL,
    overflow: 'hidden',
  },
});
export default GlassView;
