export interface BrutalCameraModalProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (uri: string) => void;
}
