import StartScreen from './StartScreen';
import QuestionScreen from './QuestionScreen';
import ResultScreen from './ResultScreen';
import OTTListScreen from './OTTListScreen';
import MeetingScreen from './MeetingScreen';

/**
 * SDUI 컴포넌트 레지스트리
 * 서버에서 내려준 type 문자열에 따라 해당 컴포넌트를 렌더링
 */
const COMPONENT_MAP = {
  StartScreen,
  QuestionScreen,
  ResultScreen,
  OTTListScreen,
  MeetingScreen,
};

/**
 * SDUI 렌더러
 * screenType: 서버 데이터의 type
 * payload: 해당 화면에 전달할 props
 * shows: OTTListScreen용 data.shows
 * meeting: role, approvedEvents, myEvents, pendingEvents, selectedEventId, createFormOpen, createFormData
 */
export default function SDUIRenderer({
  screenType,
  payload,
  onAction,
  questionText,
  currentIndex,
  totalCount,
  contentPayload,
  shows,
  meetingRole,
  approvedEvents,
  myEvents,
  pendingEvents,
  selectedEventId,
  createFormOpen,
  createFormData,
}) {
  const Component = COMPONENT_MAP[screenType];
  if (!Component) {
    return (
      <div style={{ padding: 20, color: '#999' }}>
        알 수 없는 화면 타입: {screenType}
      </div>
    );
  }

  if (screenType === 'MeetingScreen') {
    return (
      <MeetingScreen
        role={meetingRole}
        payload={payload}
        approvedEvents={approvedEvents ?? []}
        myEvents={myEvents ?? []}
        pendingEvents={pendingEvents ?? []}
        selectedEventId={selectedEventId}
        createFormOpen={createFormOpen}
        createFormData={createFormData}
        onAction={onAction}
      />
    );
  }

  if (screenType === 'OTTListScreen') {
    return (
      <OTTListScreen
        payload={payload}
        shows={shows ?? []}
        onAction={onAction}
      />
    );
  }

  if (screenType === 'StartScreen') {
    return <StartScreen payload={payload} onAction={onAction} />;
  }

  if (screenType === 'QuestionScreen') {
    return (
      <QuestionScreen
        payload={payload}
        questionText={questionText}
        currentIndex={currentIndex}
        totalCount={totalCount}
        onAction={onAction}
      />
    );
  }

  if (screenType === 'ResultScreen') {
    return (
      <ResultScreen
        contentPayload={contentPayload}
        screenPayload={payload}
        onAction={onAction}
      />
    );
  }

  return null;
}

export { COMPONENT_MAP };
