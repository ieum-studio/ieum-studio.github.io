# 꼰대 판독기 - SDUI (Server-Driven UI)

서버에서 내려주는 데이터(`data.json`)에 따라 화면을 구성하는 React 기반 SDUI 구조입니다.

## 실행 방법

```bash
npm install
npm run dev
```

- **꼰대 판독기**: `http://localhost:5173`
- **소비 습관 판독기** (flex): `http://localhost:5173?data=flex`
- **밈 감성 한 줄 생성기** (meme): `http://localhost:5173?data=meme`

## 프로젝트 구조

```
├── public/
│   ├── data.json          # 꼰대 판독기 (서버 응답 가정)
│   ├── flex.json          # 소비 습관 판독기 (?data=flex)
│   └── meme.json          # 밈 한 줄 생성기 (?data=meme)
├── src/
│   ├── App.jsx            # 퀴즈 상태 관리 + data.json fetch 후 SDUI 렌더링
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── SDUIRenderer.jsx   # type에 따라 컴포넌트 매핑 후 렌더
│   │   ├── Container.jsx      # 공통 레이아웃
│   │   ├── Character.jsx      # 이모지 표시
│   │   ├── Button.jsx         # 버튼 (variant: default/yes/no)
│   │   ├── StartScreen.jsx    # 시작 화면
│   │   ├── QuestionScreen.jsx # 질문 화면
│   │   ├── ResultScreen.jsx   # 결과 화면
│   │   └── ads/               # SDUI 광고 컴포넌트
│   │       ├── AdRenderer.jsx   # 플랫폼별 광고 렌더러
│   │       ├── AdBannerPC.jsx   # 카카오 애드핏 PC (하단)
│   │       ├── AdBannerMobile.jsx # 카카오 애드핏 모바일 (하단)
│   │       └── AdFullscreen.jsx # 전면형 (앱 인앱, X로 닫기)
│   ├── hooks/
│   │   └── usePlatform.js    # web / mobileWeb / app 감지
│   └── ...
└── package.json
```

## SDUI 동작 방식

1. **데이터**: `public/data.json`을 서버 응답으로 간주하고 `fetch('/data.json')`으로 로드합니다.
2. **화면 타입**: `screens.start`, `screens.question`, `screens.result`에 각 화면의 `type`과 `payload`가 정의되어 있습니다.
3. **렌더링**: `App`이 현재 화면 상태(`start` / `question` / `result`)에 맞는 스크린 데이터를 선택하고, `SDUIRenderer`가 `type`(StartScreen, QuestionScreen, ResultScreen)에 따라 해당 컴포넌트에 `payload`를 넘겨 렌더링합니다.
4. **컴포넌트**: 각 화면/요소는 하나의 파일로 분리되어 있으며, 서버에서 내려준 `payload`만으로 동작하도록 작성되어 있습니다.

## data.json 구조 요약

- **app**: 앱 제목, 총 질문 수 등
- **screens**: 화면별 `type` + `payload` (시작/질문/결과)
- **questions**: 질문 문자열 배열
- **results**: 점수 구간별 결과 콘텐츠 (`high` / `low`)

서버에서 문구, 버튼 라벨, 이모지, 결과 문구 등을 바꾸면 클라이언트는 그대로 반영하여 표시합니다.

---

## SDUI 광고 (플랫폼별 광고 형식)

서버에서 내려주는 `data.json`의 **ads** 섹션에 따라, 플랫폼별로 다른 광고 형식을 SDUI 방식으로 렌더링합니다.

### 1. 웹 (PC)

- **형식**: 카카오 애드핏 PC 버전
- **위치**: 페이지 **하단** 고정 (fixed bottom)
- **컴포넌트**: `AdBannerPC.jsx`
- **서버 payload**: `unitId`, `width`, `height`, `scriptUrl` (카카오 애드핏 PC 유닛 ID 및 사이즈)
- **동작**: `ins.kakao_ad_area` + 카카오 애드핏 스크립트 로드, 하단에 배너 표시

### 2. 모바일 웹

- **형식**: 카카오 애드핏 모바일 버전
- **위치**: 페이지 **하단** 고정 (fixed bottom)
- **컴포넌트**: `AdBannerMobile.jsx`
- **서버 payload**: `unitId`, `width`, `height`, `scriptUrl` (모바일용 유닛 ID, 예: 320×50)
- **동작**: PC와 동일한 SDUI 구조, 모바일용 유닛/사이즈만 다르게 내려줌

### 3. 앱 인앱 (인토스 등)

- **형식**: **전면형** 광고
- **위치**: 페이지 **전면** (전체 화면 오버레이)
- **컴포넌트**: `AdFullscreen.jsx`
- **서버 payload**: `closeButtonLabel`(예: "×"), `closeButtonAriaLabel`, `imageUrl`, `durationSeconds` 등
- **동작**: X(닫기) 버튼 클릭 시 화면에서 사라짐. 서버에서 `imageUrl`을 주면 이미지 전면 배너로 표시

### 플랫폼 감지

- **훅**: `usePlatform()` (`src/hooks/usePlatform.js`)
- **반환값**: `'web'` | `'mobileWeb'` | `'app'`
- **규칙**:
  - `?platform=app` 또는 `?platform=mobileWeb` 등 **URL 쿼리**가 있으면 해당 값 사용
  - `window.__IS_APP__ === true` 이면 **앱** (인앱 WebView 가 이 값을 설정한다고 가정)
  - 그 외: 뷰포트/User-Agent로 **모바일**이면 `mobileWeb`, 아니면 `web`

### data.json ads 구조

```json
"ads": {
  "enabled": true,
  "platforms": {
    "web": {
      "type": "AdBannerPC",
      "payload": { "placement": "bottom", "unitId": "...", "width": 728, "height": 90, "scriptUrl": "..." }
    },
    "mobileWeb": {
      "type": "AdBannerMobile",
      "payload": { "placement": "bottom", "unitId": "...", "width": 320, "height": 50, "scriptUrl": "..." }
    },
    "app": {
      "type": "AdFullscreen",
      "payload": { "placement": "fullscreen", "closeButtonLabel": "×", "imageUrl": "", ... }
    }
  }
}
```

- **SDUI 요약**: 서버가 `ads.platforms[platform].type`과 `payload`만 바꿔서 내려주면, 클라이언트는 **AdRenderer**가 플랫폼에 맞는 컴포넌트(AdBannerPC / AdBannerMobile / AdFullscreen)를 골라 같은 방식으로 렌더링합니다.
