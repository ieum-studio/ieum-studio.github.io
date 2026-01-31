import Container from './Container';
import Character from './Character';
import Button from './Button';
import styles from './StartScreen.module.css';

/**
 * SDUI 시작 화면 컴포넌트
 * 서버 payload: { character, title, description, primaryAction }
 */
export default function StartScreen({ payload, onAction }) {
  if (!payload) return null;

  const { character, title, description, primaryAction } = payload;
  const handleClick = () => {
    if (primaryAction?.action && onAction) {
      onAction(primaryAction.action);
    }
  };

  return (
    <Container>
      <Character character={character} />
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>
        {description?.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < description.split('\n').length - 1 && <br />}
          </span>
        ))}
      </p>
      <Button
        label={primaryAction?.label ?? 'START'}
        onClick={handleClick}
      />
    </Container>
  );
}
