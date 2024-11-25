import { Router } from 'express';
const multer = require('multer'); //이미지 업로드 플러그인
const mime = require('mime-types'); //파일 확장자 제어
import { v4 as uuidv4 } from 'uuid'; //업로드한 이미지 이름 고유한 id로 저장
const path = require('path');
const fs = require('fs');

import { setProfile } from '../controllers/uploadController';

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/profile'); // 경로 설정

    // 디렉토리 존재 여부 확인 후 생성
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // 부모 디렉토리까지 생성
    }
    cb(null, uploadPath); // 정상적으로 경로 설정
  },
  filename: (req, file, cb) =>
    cb(null, `${uuidv4()}.${mime.extension(file.mimetype)}`), //uuid 사용 + 파일 확장자 제어
});

const profileUpload = multer({ storage: profileStorage }); //uploads 폴더에 요청한 이미지 저장
const uploadRouter = Router();

// 프로필 업로드 요청 처리
uploadRouter.post('/profile', profileUpload.single('image'), setProfile);

export default uploadRouter;
