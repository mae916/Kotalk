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
