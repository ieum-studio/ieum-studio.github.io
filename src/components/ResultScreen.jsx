import Container from './Container';
import Character from './Character';
import Button from './Button';
import styles from './ResultScreen.module.css';

/**
 * SDUI 결과 화면 컴포넌트
 * contentPayload: 서버에서 내려준 결과 내용 { character, title, description[] }
 * screenPayload: { retryButton }
 */
export default function ResultScreen({ contentPayload, screenPayload, onAction }) {
  if (!contentPayload && !screenPayload) return null;

  const retryButton = screenPayload?.retryButton ?? { label: '다시 하기', action: 'retry' };
  const handleRetry = () => onAction?.(retryButton.action);

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
