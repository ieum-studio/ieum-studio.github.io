import { useEffect, useRef } from 'react';
import styles from './AdBannerMobile.module.css';

/**
 * SDUI 광고: 카카오 애드핏 모바일 버전
 * 서버 payload: { placement, unitId, width, height, scriptUrl }
 * 페이지 하단에 배치 (모바일 사이즈)
 */
export default function AdBannerMobile({ payload }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!payload?.unitId || !containerRef.current) return;

    const { unitId, width, height, scriptUrl } = payload;
    const container = containerRef.current;

    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.setAttribute('data-ad-unit', unitId);
    ins.setAttribute('data-ad-width', String(width));
    ins.setAttribute('data-ad-height', String(height));
    ins.style.display = 'none';
    ins.style.width = '100%';
    container.appendChild(ins);

    const script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.src = scriptUrl || 'https://t1.daumcdn.net/kas/static/ba.min.js';
    container.appendChild(script);

    return () => {
      try {
        if (window.adfit?.destroy) window.adfit.destroy(unitId);
      } catch (_) {}
      container.innerHTML = '';
    };
  }, [payload?.unitId, payload?.scriptUrl, payload?.width, payload?.height]);

  if (!payload?.unitId) return null;

  return (
    <aside
      ref={containerRef}
      className={styles.wrapper}
      role="complementary"
      aria-label="광고"
      data-placement={payload.placement}
    />
  );
}
