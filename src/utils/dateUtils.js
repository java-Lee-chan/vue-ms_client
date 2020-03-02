// eslint-disable-next-line
export function formatDate(time) {
  if (!time) return '';
  const date = new Date(time);
  return (
    `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  )
}
