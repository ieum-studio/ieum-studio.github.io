import { useState } from 'react';
import styles from './AdFullscreen.module.css';

/**
 * SDUI 광고: 전면형 (앱 인앱용)
 * 서버 payload: { placement, closeButtonLabel, closeButtonAriaLabel, imageUrl, durationSeconds }
 * X 버튼 클릭 시 화면에서 사라짐. 페이지 전면에 위치
 */
export default function AdFullscreen({ payload, onClose }) {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  const {
    closeButtonLabel = '닫기',
    closeButtonAriaLabel = '광고 닫기',
    imageUrl,
  } = payload ?? {};

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="전면 광고"
      data-placement="fullscreen"
    >
      <div className={styles.content}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            전면형 광고 영역
            <br />
            <span className={styles.placeholderSub}>(앱 인앱 전면 배너)</span>
          </div>
        )}
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label={closeButtonAriaLabel}
          title={closeButtonAriaLabel}
        >
          <span className={styles.closeLabel}>{closeButtonLabel}</span>
        </button>
      </div>
    </div>
  );
}
