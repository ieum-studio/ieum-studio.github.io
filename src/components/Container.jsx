import styles from './Container.module.css';

/**
 * SDUI 공통 레이아웃 컨테이너
 * 서버에서 내려준 화면을 감싸는 카드형 레이아웃
 */
export default function Container({ children, className = '' }) {
  return (
    <div className={`${styles.container} ${className}`.trim()}>
      {children}
    </div>
  );
}
