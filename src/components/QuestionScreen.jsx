import Container from './Container';
import Button from './Button';
import styles from './QuestionScreen.module.css';

/**
 * SDUI 질문 화면 컴포넌트
 * payload: { progressLabel, yesButton, noButton }
 * 서버에서 버튼 라벨/액션을 내려줌. progressLabel은 {{current}}/{{total}} 템플릿
 */
export default function QuestionScreen({ payload, questionText, currentIndex, totalCount, onAction }) {
  if (!payload) return null;

  const { yesButton, noButton } = payload;
  const progressText = `${currentIndex + 1} / ${totalCount}`;

  const handleYes = () => onAction?.(yesButton?.action ?? 'answerYes', true);
  const handleNo = () => onAction?.(noButton?.action ?? 'answerNo', false);

  return (
    <Container>
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
