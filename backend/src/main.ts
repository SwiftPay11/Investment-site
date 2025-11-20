import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "https://www.nextrade.pro",
      "https://nextrade.pro",
      "https://nextradex.netlify.app",
      "http://localhost:3000",
    ],
    credentials: true,
  });

  const port = process.env.PORT || 5000;

  await app.listen(port, "0.0.0.0");
  console.log(`Server running on port ${port}`);
}

bootstrap();
