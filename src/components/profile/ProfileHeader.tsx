import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

interface ProfileHeaderProps {
  username: string;
  email: string;
  avatarUrl: string;
  playlistsCount: number;
  followingCount: number;
  minutesListened: string;
  bio?: string;
  location?: string;
  website?: string;
}

// Component hiển thị thông tin đầu trang cá nhân gồm ảnh đại diện, tên tuổi, email và các chỉ số thống kê
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  email,
  avatarUrl,
  playlistsCount,
  followingCount,
  minutesListened,
  bio,
  location,
  website,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.PRIMARY, COLORS.SECONDARY]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatarGradient}
      >
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      </LinearGradient>

      <Text style={styles.name}>{username}</Text>
      <Text style={styles.email}>{email}</Text>

      {/* Hiển thị tiểu sử ngắn nếu người dùng có điền */}
      {!!bio && (
        <Text style={styles.bioText} numberOfLines={2}>
          {bio}
        </Text>
      )}

      {/* Hiển thị vị trí địa lý hoặc website cá nhân */}
      {(!!location || !!website) && (
        <View style={styles.infoRow}>
          {!!location && (
            <View style={styles.infoBadge}>
              <Feather name="map-pin" size={10} color={COLORS.TEXT_SECONDARY} style={styles.infoIcon} />
              <Text style={styles.infoText}>{location}</Text>
            </View>
          )}
          {!!website && (
            <View style={styles.infoBadge}>
              <Feather name="link" size={10} color={COLORS.TEXT_SECONDARY} style={styles.infoIcon} />
              <Text style={styles.infoText} numberOfLines={1}>{website}</Text>
            </View>
          )}
        </View>
      )}

      <LinearGradient
        colors={[COLORS.PRIMARY, COLORS.TERTIARY]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.badgeContainer}
      >
        <Text style={styles.badgeText}>PREMIUM MEMBER</Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{playlistsCount}</Text>
          <Text style={styles.statLabel}>Playlists</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{followingCount}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{minutesListened}</Text>
          <Text style={styles.statLabel}>Mins Listened</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: COLORS.SURFACE,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    marginBottom: 16,
  },
  badgeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 24,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#ffffff",
    fontFamily: "Outfit",
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  bioText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    textAlign: "center",
    paddingHorizontal: 30,
    marginTop: -8,
    marginBottom: 12,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  infoIcon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
    maxWidth: 150,
  },
});
