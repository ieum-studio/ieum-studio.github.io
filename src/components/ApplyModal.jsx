import { useState } from 'react';
import Button from './Button';
import styles from './ApplyModal.module.css';

/**
 * 참여 신청 모달
 * event: { title, template[] }
 * onClose, onSubmit(answers: { [field]: value })
 */
export default function ApplyModal({ event, onClose, onSubmit }) {
  const [answers, setAnswers] = useState(() => {
    const init = {};
    (event?.template ?? []).forEach((q) => {
      init[q] = '';
    });
    return init;
  });

  const handleChange = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(answers);
  };

  if (!event) return null;

  const template = event.template ?? [];

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="참여 신청">
      <div className={styles.modal}>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.desc}>창업자가 요청한 정보를 입력해주세요.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fields}>
            {template.map((q) => (
              <div key={q} className={styles.field}>
                <label className={styles.label}>{q}</label>
                <input
                  type="text"
                  placeholder={`${q}을(를) 입력하세요`}
                  className={styles.input}
                  value={answers[q] ?? ''}
                  onChange={(e) => handleChange(q, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <Button
              type="button"
              label="닫기"
              variant="retry"
              onClick={onClose}
            />
            <button type="submit" className={styles.submitBtn}>
              제출 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
