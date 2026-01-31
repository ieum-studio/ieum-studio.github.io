import Container from './Container';
import Button from './Button';
import styles from './OTTListScreen.module.css';

/**
 * SDUI OTT 주간 신작 목록 화면
 * payload: { weekBadge, title, subtitle, shareButton }
 * shows: 서버 data.shows 배열 [{ platform, name, review }]
 */
export default function OTTListScreen({ payload, shows = [], onAction }) {
  const weekBadge = payload?.weekBadge ?? '';
  const title = payload?.title ?? '주간 OTT 신작';
  const subtitle = payload?.subtitle ?? '';
  const shareButton = payload?.shareButton ?? { label: '공유하기', action: 'share' };

  const handleShare = () => onAction?.(shareButton.action);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        {weekBadge && (
          <span className={styles.weekBadge}>{weekBadge}</span>
        )}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>

      <Container className={styles.listWrap}>
        {shows.length === 0 ? (
          <p className={styles.empty}>이번 주 신작이 없습니다.</p>
        ) : (
          <ul className={styles.list} role="list">
            {shows.map((show, i) => (
              <li key={i} className={`${styles.card} ${styles[show.platform] ?? ''}`.trim()}>
                <span className={styles.platform}>
                  {(show.platform ?? '').toUpperCase()} NEW
                </span>
                <h2 className={styles.showTitle}>{show.name}</h2>
                <p className={styles.review}>"{show.review}"</p>
              </li>
            ))}
          </ul>
        )}
        <div className={styles.footer}>
          <Button
            label={shareButton?.label}
            variant={shareButton?.variant ?? 'default'}
            onClick={handleShare}
          />
        </div>
      </Container>
    </div>
  );
}
