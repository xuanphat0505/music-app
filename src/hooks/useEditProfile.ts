import { useState, useEffect, useRef } from "react";
import { Animated, Dimensions, BackHandler, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/apis/authApi";
import { showSuccess, showError } from "@/utils/toast";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface UseEditProfileProps {
  visible: boolean;
  onClose: () => void;
}

// Custom hook quản lý trạng thái, hoạt họa và các luồng xử lý ảnh cho màn hình chỉnh sửa hồ sơ
export const useEditProfile = ({ visible, onClose }: UseEditProfileProps) => {
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("prefer_not_to_say");
  const [avatarUri, setAvatarUri] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State quản lý việc hiển thị modal cắt ảnh và URI ảnh được chọn ban đầu
  const [cropImageUri, setCropImageUri] = useState("");

  // State điều khiển Bottom Sheet tùy chọn ảnh đại diện
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const menuAnim = useRef(new Animated.Value(300)).current;

  // Giá trị animation dịch chuyển ngang cho màn hình slide-in
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const [shouldRender, setShouldRender] = useState(false);

  // Kích hoạt hoạt họa trượt vào hoặc trượt ra dựa theo trạng thái visible
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
        setShowAvatarMenu(false);
      });
    }
  }, [visible, slideAnim]);

  // Đăng ký bộ lắng nghe sự kiện nút Back cứng trên Android để đóng view trượt
  useEffect(() => {
    const handleBackButton = () => {
      if (visible) {
        onClose();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton,
    );

    return () => backHandler.remove();
  }, [visible, onClose]);

  // Đồng bộ thông tin người dùng từ store vào các ô input khi view hiển thị
  useEffect(() => {
    if (visible && user) {
      setUsername(user.username || "");
      setAvatarUri(user.avatar || "");
      setBio(user.profile?.bio || "");
      setLocation(user.profile?.location || "");
      setWebsite(user.profile?.website || "");

      if (user.profile?.dateOfBirth) {
        const date = new Date(user.profile.dateOfBirth);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        setDateOfBirth(`${yyyy}-${mm}-${dd}`);
      } else {
        setDateOfBirth("");
      }

      setGender(user.profile?.gender || "prefer_not_to_say");
    }
  }, [visible, user]);

  // Hàm kích hoạt mở Bottom Sheet lựa chọn nguồn ảnh
  const openAvatarMenu = () => {
    setShowAvatarMenu(true);
    Animated.spring(menuAnim, {
      toValue: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: true,
    }).start();
  };

  // Hàm kích hoạt đóng Bottom Sheet lựa chọn nguồn ảnh
  const closeAvatarMenu = () => {
    Animated.timing(menuAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowAvatarMenu(false);
    });
  };

  // Hàm tải ảnh đại diện lên máy chủ và cập nhật URI tạm thời
  const uploadImage = async (selectedImage: ImagePicker.ImagePickerAsset) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      const fileToUpload = {
        uri:
          Platform.OS === "ios"
            ? selectedImage.uri.replace("file://", "")
            : selectedImage.uri,
        type: selectedImage.mimeType || "image/jpeg",
        name: selectedImage.fileName || "avatar.jpg",
      } as any;

      formData.append("avatar", fileToUpload);

      const response: any = await authApi.uploadAvatar(formData);
      if (response?.data?.avatarUrl) {
        setAvatarUri(response.data.avatarUrl);
        showSuccess("Tải ảnh thành công", "Ảnh đại diện đã được cập nhật.");
      }
    } catch (error) {
      showError("Lỗi tải ảnh", "Có lỗi xảy ra khi upload ảnh lên server.");
    } finally {
      setIsUploading(false);
    }
  };

  // Hàm xử lý việc mở album ảnh và chọn ảnh
  const handleSelectImage = async () => {
    closeAvatarMenu();
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showError(
          "Quyền truy cập",
          "Ứng dụng cần quyền truy cập thư viện ảnh để đổi avatar.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCropImageUri(result.assets[0].uri);
      }
    } catch (error) {
      showError("Lỗi", "Không thể mở thư viện ảnh.");
    }
  };

  // Hàm xử lý việc mở camera và chụp ảnh trực tiếp
  const handleTakePhoto = async () => {
    closeAvatarMenu();
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        showError(
          "Quyền truy cập",
          "Ứng dụng cần quyền truy cập máy ảnh để chụp avatar mới.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCropImageUri(result.assets[0].uri);
      }
    } catch (error) {
      showError("Lỗi", "Không thể mở máy ảnh.");
    }
  };

  // Hàm xử lý khi hoàn tất việc cắt ảnh trên crop modal của app
  const handleCropComplete = async (croppedUri: string) => {
    setCropImageUri("");
    await uploadImage({
      uri: croppedUri,
      mimeType: "image/jpeg",
      fileName: "avatar.jpg",
    } as any);
  };

  // Hàm xử lý kiểm tra biểu mẫu và lưu thay đổi lên cơ sở dữ liệu
  const handleSave = async () => {
    if (!username.trim()) {
      showError("Thông báo", "Tên người dùng không được bỏ trống.");
      return;
    }

    if (dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      showError("Lỗi định dạng", "Ngày sinh phải ở định dạng YYYY-MM-DD.");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        username,
        bio,
        location,
        website,
        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth).toISOString()
          : undefined,
        gender,
        avatar: avatarUri,
      });
      showSuccess("Cập nhật thành công", "Thông tin hồ sơ đã được lưu trữ.");
      onClose();
    } catch (err: any) {
      const msg = err?.message || "Có lỗi xảy ra khi cập nhật thông tin.";
      showError("Cập nhật thất bại", msg);
    } finally {
      setIsSaving(false);
    }
  };

  return {
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
  };
};
