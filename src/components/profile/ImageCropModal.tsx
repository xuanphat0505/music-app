import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import Slider from "@react-native-community/slider";
import { COLORS } from "@/constants/Colors";
import { showError } from "@/utils/toast";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTAINER_SIZE = SCREEN_WIDTH;
const CROP_SIZE = 280;

interface ImageCropModalProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  onCropComplete: (croppedUri: string) => void;
}

// Component modal tùy chỉnh ảnh đại diện
export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  visible,
  imageUri,
  onClose,
  onCropComplete,
}) => {
  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);
  const [currentUri, setCurrentUri] = useState(imageUri);
  const [scale, setScale] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Vị trí kéo của ảnh
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const lastPosition = useRef({ x: 0, y: 0 });
  const currentX = useRef(0);
  const currentY = useRef(0);

  // Lấy kích thước thực tế của ảnh khi URI thay đổi hoặc khi hiển thị modal
  useEffect(() => {
    if (visible && imageUri) {
      setCurrentUri(imageUri);
      setScale(1);
      pan.setValue({ x: 0, y: 0 });
      lastPosition.current = { x: 0, y: 0 };
      currentX.current = 0;
      currentY.current = 0;

      Image.getSize(
        imageUri,
        (width, height) => {
          setOrigWidth(width);
          setOrigHeight(height);
        },
        () => {
          showError("Lỗi ảnh", "Không thể lấy kích thước của ảnh gốc.");
        }
      );
    }
  }, [visible, imageUri]);

  // Thiết lập PanResponder để lắng nghe cử chỉ kéo ảnh của người dùng
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (e, gestureState) => {
        const nextX = gestureState.dx + lastPosition.current.x;
        const nextY = gestureState.dy + lastPosition.current.y;

        pan.setValue({ x: nextX, y: nextY });
        currentX.current = nextX;
        currentY.current = nextY;
      },
      onPanResponderRelease: () => {
        lastPosition.current.x = currentX.current;
        lastPosition.current.y = currentY.current;
      },
    })
  ).current;

  // Tính toán kích thước ban đầu của ảnh để hiển thị vừa trong container vuông
  let initWidth = CONTAINER_SIZE;
  let initHeight = CONTAINER_SIZE;

  if (origWidth > 0 && origHeight > 0) {
    if (origWidth > origHeight) {
      initWidth = CONTAINER_SIZE * (origWidth / origHeight);
      initHeight = CONTAINER_SIZE;
    } else {
      initWidth = CONTAINER_SIZE;
      initHeight = CONTAINER_SIZE * (origHeight / origWidth);
    }
  }

  // Hàm xoay ảnh 90 độ dùng expo-image-manipulator trực tiếp trên giao diện cắt
  const handleRotate = async () => {
    setIsProcessing(true);
    try {
      const result = await manipulateAsync(
        currentUri,
        [{ rotate: 90 }],
        { compress: 0.9, format: SaveFormat.JPEG }
      );
      setCurrentUri(result.uri);
      
      // Hoán đổi kích thước rộng dài của ảnh sau khi xoay
      const tempWidth = origWidth;
      setOrigWidth(origHeight);
      setOrigHeight(tempWidth);
      
      // Đặt lại các thông số vị trí kéo dịch chuyển về tâm
      pan.setValue({ x: 0, y: 0 });
      lastPosition.current = { x: 0, y: 0 };
      currentX.current = 0;
      currentY.current = 0;
    } catch (error) {
      showError("Lỗi xoay ảnh", "Không thể xoay ảnh.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Hàm xử lý cắt ảnh dựa trên tỷ lệ phóng to và vị trí tọa độ dịch chuyển thực tế
  const handleSaveCrop = async () => {
    if (origWidth === 0 || origHeight === 0) return;
    setIsProcessing(true);

    try {
      const dispWidth = initWidth * scale;
      const dispHeight = initHeight * scale;

      // Tính toán toạ độ của khung cắt so với ảnh hiển thị thực tế (bằng khoảng cách từ biên trái/trên của ảnh đến biên trái/trên của khung ngắm)
      const cropLeft = dispWidth / 2 - CROP_SIZE / 2 - currentX.current;
      const cropTop = dispHeight / 2 - CROP_SIZE / 2 - currentY.current;

      // Quy đổi toạ độ khung cắt hiển thị về toạ độ trên file ảnh gốc
      const origCropX = Math.max(0, (cropLeft / dispWidth) * origWidth);
      const origCropY = Math.max(0, (cropTop / dispHeight) * origHeight);
      const origCropW = (CROP_SIZE / dispWidth) * origWidth;
      const origCropH = (CROP_SIZE / dispHeight) * origHeight;

      // Kiểm tra chặn toạ độ cắt vượt ra ngoài khung biên của ảnh gốc
      const finalCropW = Math.min(origCropW, origWidth - origCropX);
      const finalCropH = Math.min(origCropH, origHeight - origCropY);

      const result = await manipulateAsync(
        currentUri,
        [
          {
            crop: {
              originX: Math.round(origCropX),
              originY: Math.round(origCropY),
              width: Math.round(finalCropW),
              height: Math.round(finalCropH),
            },
          },
          {
            resize: {
              width: 400,
              height: 400,
            },
          },
        ],
        { compress: 0.85, format: SaveFormat.JPEG }
      );

      onCropComplete(result.uri);
    } catch (error) {
      showError("Lỗi cắt ảnh", "Không thể cắt ảnh đại diện.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Thanh Header của Modal */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Feather name="x" size={24} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cắt ảnh đại diện</Text>
          <TouchableOpacity
            onPress={handleSaveCrop}
            disabled={isProcessing}
            style={styles.headerButton}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color={COLORS.PRIMARY} />
            ) : (
              <Feather name="check" size={24} color={COLORS.PRIMARY} />
            )}
          </TouchableOpacity>
        </View>

        {/* Khung chứa ảnh hiển thị và khung cắt kéo thả */}
        <View style={styles.cropAreaContainer}>
          <View
            style={[styles.imageContainer, { width: CONTAINER_SIZE, height: CONTAINER_SIZE }]}
            {...panResponder.panHandlers}
          >
            <Animated.Image
              source={{ uri: currentUri }}
              style={[
                styles.image,
                {
                  width: initWidth,
                  height: initHeight,
                  transform: [
                    { translateX: pan.x },
                    { translateY: pan.y },
                    { scale: scale },
                  ],
                },
              ]}
              resizeMode="contain"
            />

            {/* Lớp phủ mờ phần ngoài vùng cắt và khung tròn ngắm cắt ở giữa */}
            <View style={styles.overlayContainer} pointerEvents="none">
              <View style={styles.overlayTop} />
              <View style={styles.overlayMiddleRow}>
                <View style={styles.overlaySide} />
                <View style={styles.cropFrame} />
                <View style={styles.overlaySide} />
              </View>
              <View style={styles.overlayBottom} />
            </View>
          </View>
        </View>

        {/* Khu vực thanh trượt zoom và các nút xoay hỗ trợ */}
        <View style={styles.controlContainer}>
          <View style={styles.zoomRow}>
            <Feather name="minus" size={16} color={COLORS.TEXT_SECONDARY} />
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={4}
              value={scale}
              onValueChange={(val) => setScale(val)}
              minimumTrackTintColor={COLORS.PRIMARY}
              maximumTrackTintColor="rgba(255,255,255,0.15)"
              thumbTintColor={COLORS.PRIMARY}
            />
            <Feather name="plus" size={16} color={COLORS.TEXT_SECONDARY} />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.controlButton} onPress={handleRotate}>
              <Feather name="rotate-cw" size={20} color={COLORS.TEXT_PRIMARY} />
              <Text style={styles.controlButtonText}>Xoay ảnh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                setScale(1);
                pan.setValue({ x: 0, y: 0 });
                lastPosition.current = { x: 0, y: 0 };
                currentX.current = 0;
                currentY.current = 0;
              }}
            >
              <Feather name="refresh-cw" size={20} color={COLORS.TEXT_PRIMARY} />
              <Text style={styles.controlButtonText}>Đặt lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#08080A",
  },
  header: {
    height: Platform.OS === "ios" ? 88 : 64,
    paddingTop: Platform.OS === "ios" ? 44 : 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Outfit",
  },
  cropAreaContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    backgroundColor: "#000",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    maxHeight: "200%",
    maxWidth: "200%",
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  overlayMiddleRow: {
    height: CROP_SIZE,
    flexDirection: "row",
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  cropFrame: {
    width: CROP_SIZE,
    height: CROP_SIZE,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderRadius: CROP_SIZE / 2,
  },
  controlContainer: {
    paddingBottom: Platform.OS === "ios" ? 44 : 24,
    paddingHorizontal: 20,
  },
  zoomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  controlButtonText: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: "Inter",
  },
});
