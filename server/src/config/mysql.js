import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const database = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: "Asia/Seoul",
  dateStrings:true
});

// database.connect((err) => {
//   if (err) {
//     console.error('데이터베이스 연결 실패:', err);
//     process.exit(1);
//   } else {
//     console.log('데이터베이스에 성공적으로 연결되었습니다.');
//   }
// });

export default database;
