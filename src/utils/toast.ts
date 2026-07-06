import Toast from "react-native-toast-message";

// Hiển thị thông báo thành công (Success Toast)
export const showSuccess = (title: string, message?: string) => {
  Toast.show({
    type: "success",
    text1: title,
    text2: message,
  });
};

// Hiển thị thông báo lỗi (Error Toast)
export const showError = (title: string, message?: string) => {
  Toast.show({
    type: "error",
    text1: title,
    text2: message,
  });
};

// Hiển thị thông báo thông tin (Info Toast)
export const showInfo = (title: string, message?: string) => {
  Toast.show({
    type: "info",
    text1: title,
    text2: message,
  });
};
