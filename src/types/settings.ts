// Thực thể một dòng thiết lập cài đặt
export interface SettingItem {
  id: string;
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  isDestructive?: boolean;
  isSlider?: boolean;
  sliderValue?: number;
  onSliderValueChange?: (val: number) => void;
  onSliderSlidingComplete?: (val: number) => void;
}
