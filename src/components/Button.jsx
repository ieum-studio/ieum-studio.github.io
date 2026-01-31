import styles from './Button.module.css';

/**
 * SDUI 버튼 컴포넌트
 * payload: { label, variant?, action }
 * variant: default | yes | no
 */
export default function Button({ label, variant = 'default', onClick, disabled, className = '' }) {
  const variantClass = styles[variant] ?? styles.default;
  return (
    <button
      type="button"
      className={`${styles.button} ${variantClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
