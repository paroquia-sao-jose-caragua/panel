export function formatTimeDifference(
  startTime: string,
  endTime: string
): string {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startTotalMin = startHour * 60 + startMin;
  const endTotalMin = endHour * 60 + endMin;

  const diffMin = endTotalMin - startTotalMin;
  const hours = Math.floor(diffMin / 60);
  const minutes = diffMin % 60;

  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
}
