import React from "react";
import { StyleSheet, TouchableOpacity, View, TextInput } from "react-native";
import { COLORS } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchSubmit: () => void;
  onClear: () => void;
  onVoicePress: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  onClear,
  onVoicePress,
}) => {
  return (
    <View style={styles.searchBarContainer}>
      <Feather
        name="search"
        size={18}
        color={COLORS.TEXT_SECONDARY}
        style={styles.searchIcon}
      />
      <TextInput
        placeholder="Artists, songs, or podcasts"
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearchSubmit}
        returnKeyType="search"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClear}
          style={styles.clearIconContainer}
        >
          <Feather name="x" size={18} color={COLORS.TEXT_SECONDARY} />
        </TouchableOpacity>
      )}
      <TouchableOpacity activeOpacity={0.7} onPress={onVoicePress}>
        <Feather name="mic" size={18} color={COLORS.TEXT_SECONDARY} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.SURFACE,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    marginHorizontal: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Inter",
    fontSize: 14,
    paddingHorizontal: 4,
  },
  clearIconContainer: {
    padding: 4,
    marginRight: 8,
  },
});
