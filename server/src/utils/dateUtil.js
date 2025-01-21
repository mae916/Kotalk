export function mySqlNowDateTime() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().replace("T", " ").slice(0, 19);
}

export function formatDate(data) {
  const date = new Date(data); // 입력된 날짜를 Date 객체로 변환

  const now = new Date(); // 현재 시간

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 오늘의 00:00 (한국 시간)
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000); // 어제의 00:00 (한국 시간)

  // 오전/오후 표시 처리
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const amPm = hours >= 12 ? '오후' : '오전';
  hours = hours % 12;  // 12시간제로 변경
  if (hours === 0) hours = 12;  // 12시를 12로 표시

  // 오늘
  if (date >= today) {
    return `${amPm} ${hours}:${minutes}`;
  } else if (date >= yesterday) {
    // 어제
    return "어제";
  } else {
    // 그 이전
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}