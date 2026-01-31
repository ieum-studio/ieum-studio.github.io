import Container from './Container';
import Character from './Character';
import Button from './Button';
import styles from './StartScreen.module.css';

/**
 * SDUI 시작 화면 컴포넌트
 * 서버 payload: { character, title, description, primaryAction } 또는 { character, title, description, topics[] }
 * topics 있으면 주제 선택 버튼 목록, 없으면 primaryAction 단일 버튼
 */
export default function StartScreen({ payload, onAction }) {
  if (!payload) return null;

  const { character, title, description, primaryAction, topics } = payload;
  const hasTopics = Array.isArray(topics) && topics.length > 0;

  const handlePrimaryClick = () => {
    if (primaryAction?.action && onAction) {
      onAction(primaryAction.action);
    }
  };

  const handleTopicClick = (topic) => {
    if (onAction) {
      onAction(topic.action ?? 'selectTopic', topic.id);
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
      {hasTopics ? (
        <div className={styles.topicList}>
          {topics.map((topic) => (
            <Button
              key={topic.id}
              label={topic.label}
              variant="topic"
              onClick={() => handleTopicClick(topic)}
            />
          ))}
        </div>
      ) : (
        <Button
          label={primaryAction?.label ?? 'START'}
          onClick={handlePrimaryClick}
        />
      )}
    </Container>
  );
}
