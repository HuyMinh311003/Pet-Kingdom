import QRCode from 'react-qr-code';
import './QRModal.css';

interface QRModalProps {
  orderUrl: string;
  onClose: () => void;
}

export default function QRModal({ orderUrl, onClose }: QRModalProps) {
  return (
    <div className="qr-modal-backdrop">
      <div className="qr-modal">
        <h2>Quét mã ZaloPay QR</h2>
        <div className="qr-wrapper">
          <QRCode value={orderUrl} size={200} />
        </div>
        <button className="qr-close-btn" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
}
