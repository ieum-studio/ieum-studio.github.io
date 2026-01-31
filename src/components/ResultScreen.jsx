import Container from './Container';
import Character from './Character';
import Button from './Button';
import styles from './ResultScreen.module.css';

/**
 * SDUI 결과 화면 컴포넌트
 * contentPayload: { character, title, description[] } 또는 { resultTopicLabel, resultText } (한 줄 결과)
 * screenPayload: { retryButton }
 */
export default function ResultScreen({ contentPayload, screenPayload, onAction }) {
  if (!contentPayload && !screenPayload) return null;

  const retryButton = screenPayload?.retryButton ?? { label: '다시 하기', action: 'retry' };
  const handleRetry = () => onAction?.(retryButton.action);

  const hasResultText = contentPayload?.resultText != null && contentPayload.resultText !== '';

  if (hasResultText) {
    return (
      <Container className={contentPayload?.resultTheme === 'light' ? styles.resultLight : ''}>
        {contentPayload?.resultTopicLabel && (
          <p className={styles.resultTopicLabel}>{contentPayload.resultTopicLabel}</p>
        )}
        <p className={styles.resultText} role="status">
          {contentPayload.resultText}
        </p>
        <Button label={retryButton?.label} variant={retryButton?.variant} onClick={handleRetry} />
      </Container>
    );
  }

  const { titlePrefix, titleHighlight, titleHighlightVariant } = contentPayload ?? {};
  const hasTitleHighlight = titleHighlight != null && titleHighlight !== '';

  return (
    <Container>
      <Character character={contentPayload?.character} />
      <h1 className={styles.title}>
        {hasTitleHighlight ? (
          <>
            {titlePrefix}
            <span className={styles[titleHighlightVariant] ?? styles.titleHighlight}>{titleHighlight}</span>
          </>
        ) : (
          contentPayload?.title
        )}
      </h1>
      <div className={styles.resultDesc} role="region" aria-label="결과 설명">
        {contentPayload?.description?.map((line, i) => (
          <p key={i} className={styles.descItem}>
            • {line}
          </p>
        ))}
      </div>
      <Button label={retryButton?.label} variant={retryButton?.variant} onClick={handleRetry} />
    </Container>
  );
}
