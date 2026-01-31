import styles from './Character.module.css';

/**
 * SDUI 캐릭터(이모지) 표시 컴포넌트
 * payload.character 로 서버에서 내려준 이모지를 렌더링
 */
export default function Character({ character, className = '' }) {
  if (!character) return null;
  return (
    <div className={`${styles.character} ${className}`.trim()} role="img" aria-hidden="true">
      {character}
    </div>
  );
}
