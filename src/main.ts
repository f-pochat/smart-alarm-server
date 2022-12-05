import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { connect } from 'mqtt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

export const client = connect({ port: 1883, host: 'broker.hivemq.com' });

async function bootstrap() {
  client.on('connect', () => {
    console.log('Connected!');
    const topic = 'smart-alarm';
    client.subscribe([topic], () => {
      console.log(`Subscribed to topic ${topic}`);
    });
  });

  client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString());
  });

  //Init server
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Smart Alarm')
    .setDescription('Contiene endpoints esos de swagger')
    .setVersion('1.0')
    .addTag('smart-alarm')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 8080);
}

bootstrap();
