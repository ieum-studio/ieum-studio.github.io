import AdBannerPC from './AdBannerPC';
import AdBannerMobile from './AdBannerMobile';
import AdFullscreen from './AdFullscreen';

/**
 * SDUI 광고 컴포넌트 레지스트리
 * 서버에서 내려준 ads.platforms[platform].type 에 따라 해당 광고 컴포넌트 렌더링
 */
const AD_COMPONENT_MAP = {
  AdBannerPC,
  AdBannerMobile,
  AdFullscreen,
};

/**
 * SDUI 광고 렌더러
 * - serverData.ads: 서버에서 내려준 광고 설정
 * - platform: 'web' | 'mobileWeb' | 'app' (usePlatform 훅으로 감지 또는 서버 지정)
 * - 플랫폼별 type + payload 로 어떤 광고를 어디에 띄울지 서버가 결정
 */
export default function AdRenderer({ adsConfig, platform, onFullscreenClose }) {
  if (!adsConfig?.enabled || !adsConfig?.platforms) return null;

  const platformConfig = adsConfig.platforms[platform];
  if (!platformConfig) return null;

  const { type, payload } = platformConfig;
  const Component = AD_COMPONENT_MAP[type];

  if (!Component) return null;

  if (type === 'AdFullscreen') {
    return (
      <Component payload={payload} onClose={onFullscreenClose} />
    );
  }

  return <Component payload={payload} />;
}

export { AD_COMPONENT_MAP };
