import FileResizer from 'react-image-file-resizer';

type ResizeImage = (
  imageFile: File,
  width: number,
  height: number,
  quality?: number
) => Promise<Blob>;

export const resizeImage: ResizeImage = async (
  imageFile,
  width,
  height,
  quality = 100
) => {
  return new Promise<Blob>((resolve, reject) => {
    FileResizer.imageFileResizer(
      imageFile,
      width,
      height,
      'WEBP',
      quality,
      0,
      (url) => {
        if (url instanceof Blob) {
          resolve(url);
        } else {
          reject(new Error('Result is not a Blob.'));
        }
      },
      'blob'
    );
  });
};

export function handleClick(
  event: React.MouseEvent<HTMLLIElement>,
  clickFn: any,
  dbCLickFn: any
) {
  switch (event.detail) {
    case 1:
      clickFn();
      break;
    case 2:
      dbCLickFn();
      break;
  }
}

export function nowDateTime() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .replace('T', ' ')
    .slice(0, 19);
}

export function amPmformat(dateString: string) {
  const date = new Date(dateString);
  // 오전/오후 표시 처리
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const amPm = hours >= 12 ? '오후' : '오전';
  hours = hours % 12; // 12시간제로 변경
  if (hours === 0) hours = 12; // 12시를 12로 표시

  return `${amPm} ${hours}:${minutes}`;
}
