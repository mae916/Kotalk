import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Kakao Talk API',
      description: '카카오톡 클론 프로젝트 API',
    },
    servers: [
      {
        url: 'https://localhost:4000', // 요청 URL
      },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../server.js'),
  ], // 절대 경로 사용
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
