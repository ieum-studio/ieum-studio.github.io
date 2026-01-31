import Container from './Container';
import Button from './Button';
import styles from './QuestionScreen.module.css';

/**
 * SDUI 질문 화면 컴포넌트
 * payload: { progressLabel?, showProgressBar?, yesButton, noButton }
 * progressLabel: "Q{{current}}" 또는 "{{current}} / {{total}}" 등 템플릿
 */
function formatProgressLabel(template, currentIndex, totalCount) {
  if (!template) return `${currentIndex + 1} / ${totalCount}`;
  return template
    .replace(/\{\{current\}\}/g, String(currentIndex + 1))
    .replace(/\{\{total\}\}/g, String(totalCount));
}

export default function QuestionScreen({ payload, questionText, currentIndex, totalCount, onAction }) {
  if (!payload) return null;

  const { yesButton, noButton, showProgressBar, progressLabel } = payload;
  const progressText = formatProgressLabel(progressLabel, currentIndex, totalCount);
  const progressPercent = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;

  const handleYes = () => onAction?.(yesButton?.action ?? 'answerYes', true);
  const handleNo = () => onAction?.(noButton?.action ?? 'answerNo', false);

  return (
    <Container>
      {showProgressBar && (
        <div className={styles.progressBarWrap} aria-hidden="true">
          <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
        </div>
      )}
      <div className={styles.progress} aria-live="polite">
        {progressText}
      </div>
      <h2 className={styles.questionText} id="question-text">
        {questionText}
      </h2>
      <Button
        label={yesButton?.label ?? 'YES'}
        variant={yesButton?.variant ?? 'yes'}
        onClick={handleYes}
      />
      <Button
        label={noButton?.label ?? 'NO'}
        variant={noButton?.variant ?? 'no'}
        onClick={handleNo}
      />
    </Container>
  );
}
