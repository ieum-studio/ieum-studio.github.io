import { useState, useEffect } from 'react';

/**
 * 플랫폼 감지 훅
 * - web: PC 웹 (데스크톱)
 * - mobileWeb: 모바일 웹 브라우저
 * - app: 앱 인앱(인토스 등) WebView
 *
 * 앱 환경은 window.__IS_APP__ 또는 URL 쿼리 ?platform=app 으로 지정 가능
 */
const MOBILE_MAX_WIDTH = 768;
const QUERY_PLATFORM = 'platform';

export function usePlatform() {
  const [platform, setPlatform] = useState('web');

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const forced = query.get(QUERY_PLATFORM);
    if (forced === 'app' || forced === 'mobileWeb' || forced === 'web') {
      setPlatform(forced);
      return;
    }

    if (typeof window !== 'undefined' && window.__IS_APP__) {
      setPlatform('app');
      return;
    }

    const isMobile = () =>
      window.innerWidth <= MOBILE_MAX_WIDTH ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    setPlatform(isMobile() ? 'mobileWeb' : 'web');
  }, []);

  return platform;
}
