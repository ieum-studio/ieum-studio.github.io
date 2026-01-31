import { useState, useEffect } from 'react';
import SDUIRenderer from './components/SDUIRenderer';
import AdRenderer from './components/ads/AdRenderer';
import { usePlatform } from './hooks/usePlatform';

const SCREEN_START = 'start';
const SCREEN_QUESTION = 'question';
const SCREEN_RESULT = 'result';

const SCORE_THRESHOLD = 5; // YES 5개 이상이면 high 결과

/** ?data=flex 이면 소비 습관 판독기(flex.json), 그 외 꼰대 판독기(data.json) */
function getDataUrl() {
  if (typeof window === 'undefined') return '/data.json';
  const params = new URLSearchParams(window.location.search);
  return params.get('data') === 'flex' ? '/flex.json' : '/data.json';
}

export default function App() {
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const platform = usePlatform();

  // 퀴즈 상태 (클라이언트 상태)
  const [currentScreen, setCurrentScreen] = useState(SCREEN_START);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const url = getDataUrl();
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('데이터를 불러올 수 없습니다.');
        return res.json();
      })
      .then((data) => {
        setServerData(data);
        if (data?.app?.title) {
          try { document.title = data.app.title; } catch (_) {}
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAction = (actionName, value) => {
    if (actionName === 'startQuiz') {
      setCurrentScreen(SCREEN_QUESTION);
      setQuestionIndex(0);
      setScore(0);
      return;
    }

    if (actionName === 'answerYes' || actionName === 'answerNo') {
      const isYes = value === true;
      if (isYes) setScore((s) => s + 1);
      setQuestionIndex((i) => i + 1);

      const total = serverData?.questions?.length ?? 0;
      if (questionIndex + 1 >= total) {
        setCurrentScreen(SCREEN_RESULT);
      }
      return;
    }

    if (actionName === 'retry') {
      setCurrentScreen(SCREEN_START);
      setQuestionIndex(0);
      setScore(0);
      return;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#c00' }}>
        {error}
      </div>
    );
  }

  if (!serverData) {
    return null;
  }

  const screens = serverData.screens ?? {};
  const questions = serverData.questions ?? [];
  const totalQuestions = questions.length;
  const adsConfig = serverData.ads ?? null;
  const showBannerAd = adsConfig?.enabled && (platform === 'web' || platform === 'mobileWeb');

  const renderContent = () => {
    if (currentScreen === SCREEN_START) {
      const config = screens.start;
      return (
        <SDUIRenderer
          screenType={config?.type ?? 'StartScreen'}
          payload={config?.payload}
          onAction={handleAction}
        />
      );
    }

    if (currentScreen === SCREEN_QUESTION) {
      const config = screens.question;
      const questionText = questions[questionIndex] ?? '';
      return (
        <SDUIRenderer
          screenType={config?.type ?? 'QuestionScreen'}
          payload={config?.payload}
          questionText={questionText}
          currentIndex={questionIndex}
          totalCount={totalQuestions}
          onAction={handleAction}
        />
      );
    }

    if (currentScreen === SCREEN_RESULT) {
      const config = screens.result;
      const resultKey = score >= SCORE_THRESHOLD ? 'high' : 'low';
      const resultContent = serverData.results?.[resultKey];
      const contentPayload = resultContent?.payload ?? null;
      return (
        <SDUIRenderer
          screenType={config?.type ?? 'ResultScreen'}
          payload={config?.payload}
          contentPayload={contentPayload}
          onAction={handleAction}
        />
      );
    }

    return null;
  };

  return (
    <>
      <div style={{ paddingBottom: showBannerAd ? (platform === 'mobileWeb' ? 70 : 110) : 0 }}>
        {renderContent()}
      </div>
      <AdRenderer
        adsConfig={adsConfig}
        platform={platform}
        onFullscreenClose={() => {}}
      />
    </>
  );
}
