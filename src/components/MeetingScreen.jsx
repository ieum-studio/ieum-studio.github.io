import { useRef } from 'react';
import Container from './Container';
import Button from './Button';
import ApplyModal from './ApplyModal';
import styles from './MeetingScreen.module.css';

/**
 * SDUI 로테이션 소개팅 화면 (역할별 뷰)
 * role: participant | founder | admin
 * payload: 현재 역할용 payload (title, subtitle, buttons label 등)
 * approvedEvents, myEvents, pendingEvents: 서버 data.events 기반으로 App에서 필터
 * selectedEventId: 참여 신청 모달용
 * createFormOpen, createFormData: 창업자 이벤트 등록 폼
 */
export default function MeetingScreen({
  role,
  payload,
  approvedEvents = [],
  myEvents = [],
  pendingEvents = [],
  selectedEventId,
  createFormOpen,
  createFormData,
  onAction,
}) {
  const roles = payload?.roles ?? [];
  const selectedEvent = selectedEventId
    ? approvedEvents.find((e) => e.id === selectedEventId)
    : null;

  const handleRoleSwitch = (id) => onAction?.('switchRole', id);
  const handleOpenApply = (id) => onAction?.('openApply', id);
  const handleCloseApply = () => onAction?.('closeApply');
  const handleSubmitApply = (answers) => onAction?.('submitApply', { eventId: selectedEventId, answers });
  const handleOpenCreate = () => onAction?.('openCreateForm');
  const handleCloseCreate = () => onAction?.('closeCreateForm');
  const newFieldRef = useRef(null);
  const handleAddTemplate = () => {
    const name = newFieldRef.current?.value?.trim();
    if (name) {
      onAction?.('addTemplateField', name);
      if (newFieldRef.current) newFieldRef.current.value = '';
    }
  };
  const handleRemoveTemplate = (index) => onAction?.('removeTemplateField', index);
  const titleRef = useRef(null);
  const dateRef = useRef(null);
  const locRef = useRef(null);
  const handleSubmitEvent = () => {
    const title = titleRef.current?.value ?? '';
    const date = dateRef.current?.value ?? '';
    const loc = locRef.current?.value ?? '';
    onAction?.('submitEvent', { title, date, loc, template: createFormData?.template ?? [] });
  };
  const handleApprove = (id) => onAction?.('approve', id);
  const handleReject = (id) => onAction?.('reject', id);

  const roleLabel =
    role === 'participant' ? '참여자 모드' : role === 'founder' ? '창업자 모드' : '관리자 모드';

  return (
    <div className={styles.wrapper}>
      <div className={styles.roleBar}>
        {roles.map((r) => (
          <button
            key={r.id}
            type="button"
            className={styles.roleTab}
            onClick={() => handleRoleSwitch(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <header className={styles.header}>
        <h1 className={styles.brand}>ROUNDING.</h1>
        <span className={styles.roleBadge}>{roleLabel}</span>
      </header>

      {role === 'participant' && (
        <main className={styles.main}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{payload?.title}</h2>
            <p className={styles.sectionSubtitle}>{payload?.subtitle}</p>
          </div>
          <div className={styles.list}>
            {approvedEvents.length === 0 ? (
              <p className={styles.empty}>신청 가능한 로테이션이 없습니다.</p>
            ) : (
              approvedEvents.map((e) => (
                <Container key={e.id} className={styles.card}>
                  <h3 className={styles.cardTitle}>{e.title}</h3>
                  <p className={styles.cardMeta}>
                    📅 {e.date} | 📍 {e.loc}
                  </p>
                  <Button
                    label={payload?.applyButtonLabel ?? '참여 신청'}
                    variant="default"
                    onClick={() => handleOpenApply(e.id)}
                  />
                </Container>
              ))
            )}
          </div>
        </main>
      )}

      {role === 'founder' && (
        <main className={styles.main}>
          <div className={styles.sectionHeadRow}>
            <h2 className={styles.sectionTitle}>{payload?.title}</h2>
            <Button
              label={payload?.createButtonLabel ?? '+ 새 이벤트'}
              variant="default"
              onClick={handleOpenCreate}
            />
          </div>

          {createFormOpen && (
            <Container className={styles.createForm}>
              <h3 className={styles.formTitle}>{payload?.createFormTitle}</h3>
              <input
                ref={titleRef}
                type="text"
                placeholder="소개팅 제목"
                className={styles.input}
              />
              <div className={styles.row2}>
                <input ref={dateRef} type="date" className={styles.input} />
                <input
                  ref={locRef}
                  type="text"
                  placeholder="장소(강남, 홍대 등)"
                  className={styles.input}
                />
              </div>
              <div className={styles.templateBlock}>
                <label className={styles.templateLabel}>{payload?.templateLabel}</label>
                <div className={styles.templateList}>
                  {(createFormData?.template ?? []).map((field, idx) => (
                    <div key={idx} className={styles.templateItem}>
                      <span className={styles.templateQ}>Q. {field}</span>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => handleRemoveTemplate(idx)}
                        aria-label="항목 제거"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.templateAdd}>
                  <input
                    ref={newFieldRef}
                    type="text"
                    placeholder={payload?.templatePlaceholder}
                    className={styles.inputSmall}
                  />
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={handleAddTemplate}
                  >
                    {payload?.addTemplateLabel ?? '항목 추가'}
                  </button>
                </div>
              </div>
              <div className={styles.formActions}>
                <Button
                  label={payload?.cancelLabel ?? '취소'}
                  variant="retry"
                  onClick={handleCloseCreate}
                />
                <button
                  type="button"
                  className={styles.submitBtn}
                  onClick={handleSubmitEvent}
                >
                  {payload?.submitLabel ?? '등록 신청'}
                </button>
              </div>
            </Container>
          )}

          <div className={styles.list}>
            {myEvents.length === 0 ? (
              <p className={styles.empty}>등록한 이벤트가 없습니다.</p>
            ) : (
              myEvents.map((e) => (
                <Container key={e.id} className={styles.cardRow}>
                  <div>
                    <h4 className={styles.cardTitleSmall}>{e.title}</h4>
                    <span
                      className={
                        e.approved ? styles.statusOk : styles.statusPending
                      }
                    >
                      {e.approved ? '● 승인됨' : '● 검토중'}
                    </span>
                  </div>
                  <span className={styles.cardDate}>{e.date}</span>
                </Container>
              ))
            )}
          </div>
        </main>
      )}

      {role === 'admin' && (
        <main className={styles.main}>
          <h2 className={styles.sectionTitle}>{payload?.title}</h2>
          <div className={styles.list}>
            {pendingEvents.length === 0 ? (
              <p className={styles.empty}>대기 중인 요청이 없습니다.</p>
            ) : (
              pendingEvents.map((e) => (
                <Container key={e.id} className={styles.cardAdmin}>
                  <span className={styles.pendingBadge}>
                    {payload?.pendingBadge ?? '승인 대기'}
                  </span>
                  <h4 className={styles.cardTitle}>{e.title}</h4>
                  <p className={styles.cardMeta}>
                    창업자: {e.founderId} | 필드: {(e.template ?? []).join(', ')}
                  </p>
                  <div className={styles.cardActions}>
                    <Button
                      label={payload?.approveLabel ?? '승인하기'}
                      variant="topic"
                      onClick={() => handleApprove(e.id)}
                    />
                    <Button
                      label={payload?.rejectLabel ?? '반려'}
                      variant="retry"
                      onClick={() => handleReject(e.id)}
                    />
                  </div>
                </Container>
              ))
            )}
          </div>
        </main>
      )}

      {selectedEvent && (
        <ApplyModal
          event={selectedEvent}
          onClose={handleCloseApply}
          onSubmit={handleSubmitApply}
        />
      )}
    </div>
  );
}
