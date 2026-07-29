import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/Colors";
import { useEditProfile } from "@/hooks/useEditProfile";
import { ImageCropModal } from "./ImageCropModal";
import { ImageMenu } from "./ImageMenu";

interface EditProfileViewProps {
  visible: boolean;
  onClose: () => void;
}

// Component giao diện tràn màn hình dùng để chỉnh sửa chi tiết hồ sơ người dùng
export const EditProfileView: React.FC<EditProfileViewProps> = ({
  visible,
  onClose,
}) => {
  const {
    username,
    setUsername,
    bio,
    setBio,
    location,
    setLocation,
    website,
    setWebsite,
    dateOfBirth,
    setDateOfBirth,
    gender,
    setGender,
    avatarUri,
    isUploading,
    isSaving,
    showAvatarMenu,
    slideAnim,
    menuAnim,
    shouldRender,
    cropImageUri,
    setCropImageUri,
    openAvatarMenu,
    closeAvatarMenu,
    handleSelectImage,
    handleTakePhoto,
    handleCropComplete,
    handleSave,
  } = useEditProfile({ visible, onClose });

  // Hiển thị lựa chọn giới tính dạng chip
  const renderGenderOption = (val: string, label: string) => {
    const isSelected = gender === val;
    return (
      <TouchableOpacity
        key={val}
        style={[styles.genderChip, isSelected && styles.genderChipSelected]}
        onPress={() => setGender(val)}
      >
        <Text
          style={[
            styles.genderChipText,
            isSelected && styles.genderChipTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (!shouldRender) return null;

  return (
    <Animated.View
      style={[
        styles.absoluteContainer,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          {/* Header với nút quay lại kiểu điều hướng trang mới */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Feather
                name="arrow-left"
                size={24}
                color={COLORS.TEXT_PRIMARY}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving || isUploading}
              style={styles.saveButton}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={COLORS.PRIMARY} />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollForm}
          >
            {/* Ảnh đại diện & Nút chỉnh sửa */}
            <View style={styles.avatarSection}>
              <TouchableOpacity
                onPress={openAvatarMenu}
                disabled={isUploading}
                style={styles.avatarContainer}
              >
                <View style={styles.avatarImageWrapper}>
                  {avatarUri ? (
                    <Image
                      source={{ uri: avatarUri }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Feather
                        name="camera"
                        size={32}
                        color={COLORS.TEXT_SECONDARY}
                      />
                    </View>
                  )}
                  {isUploading && (
                    <View style={styles.uploadingOverlay}>
                      <ActivityIndicator size="small" color="#fff" />
                    </View>
                  )}
                </View>
                <View style={styles.editBadge}>
                  <Feather name="edit-2" size={12} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={styles.avatarHint}>Tap to change avatar</Text>
            </View>

            {/* Biểu mẫu điền thông tin */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                placeholderTextColor="rgba(255,255,255,0.3)"
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
                numberOfLines={3}
                style={[styles.textInput, styles.multilineInput]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="e.g. Hanoi, Vietnam"
                placeholderTextColor="rgba(255,255,255,0.3)"
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Website</Text>
              <TextInput
                value={website}
                onChangeText={setWebsite}
                placeholder="e.g. https://yoursite.com"
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="url"
                autoCapitalize="none"
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TextInput
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholder="YYYY-MM-DD (e.g. 1998-05-15)"
                placeholderTextColor="rgba(255,255,255,0.3)"
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderContainer}>
                {renderGenderOption("male", "Male")}
                {renderGenderOption("female", "Female")}
                {renderGenderOption("other", "Other")}
                {renderGenderOption("prefer_not_to_say", "Secret")}
              </View>
            </View>

            <View style={styles.bottomBuffer} />
          </ScrollView>
        </KeyboardAvoidingView>

        <ImageMenu
          onViewAvatar={() => void {}} //TODO
          visible={showAvatarMenu}
          menuAnim={menuAnim}
          onClose={closeAvatarMenu}
          onTakePhoto={handleTakePhoto}
          onSelectImage={handleSelectImage}
        />

        {/* Modal cắt ảnh riêng của app */}
        <ImageCropModal
          visible={!!cropImageUri}
          imageUri={cropImageUri}
          onClose={() => setCropImageUri("")}
          onCropComplete={handleCropComplete}
        />
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.BACKGROUND,
    zIndex: 9999,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    backgroundColor: COLORS.BACKGROUND,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.PRIMARY,
    fontFamily: "Outfit",
  },
  scrollForm: {
    padding: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    position: "relative",
  },
  avatarImageWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.PRIMARY,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.BACKGROUND,
    zIndex: 10,
  },
  avatarHint: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 8,
    fontFamily: "Inter",
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    textTransform: "uppercase",
    fontFamily: "Outfit",
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Inter",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  genderContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genderChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  genderChipSelected: {
    backgroundColor: "rgba(255, 90, 20, 0.15)",
    borderColor: COLORS.PRIMARY,
  },
  genderChipText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: "Inter",
  },
  genderChipTextActive: {
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
  bottomBuffer: {
    height: 120,
  },
});
