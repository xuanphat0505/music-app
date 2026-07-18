import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/Colors";
import { PLACEHOLDER_IMAGES } from "@/constants/Images";
import { Category } from "@/types";

interface CategoryListProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
}

// Tách riêng item để quản lý state hình ảnh bị lỗi độc lập
const CategoryCardItem: React.FC<{
  category: Category;
  onSelectCategory: (category: Category) => void;
}> = ({ category, onSelectCategory }) => {
  const [imgUri, setImgUri] = useState(category.coverUrl);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.categoryCardWrapper}
      onPress={() => onSelectCategory(category)}
    >
      <LinearGradient
        colors={category.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.categoryCard}
      >
        <Text style={styles.categoryTitle}>{category.title}</Text>
        <Image
          source={{ uri: imgUri || PLACEHOLDER_IMAGES.GENRE }}
          style={styles.coverImage}
          onError={() => setImgUri(PLACEHOLDER_IMAGES.GENRE)}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onSelectCategory,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitleBrowse}>Browse Categories</Text>
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <CategoryCardItem
            key={category._id}
            category={category}
            onSelectCategory={onSelectCategory}
          />
        ))}
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  sectionTitleBrowse: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryCardWrapper: {
    width: CARD_WIDTH,
    marginBottom: 4,
  },
  categoryCard: {
    height: 95,
    borderRadius: 12,
    padding: 12,
    position: "relative",
    overflow: "hidden",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "Outfit",
  },
  coverImage: {
    width: 60,
    height: 60,
    position: "absolute",
    bottom: -8,
    right: -12,
    transform: [{ rotate: "25deg" }],
    borderRadius: 4,
  },
});
