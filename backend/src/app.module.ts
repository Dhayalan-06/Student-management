import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'Dhaya@0506',
      database: process.env.DB_DATABASE || 'postgres',
      autoLoadEntities: true,
      synchronize: false,
    }),
    StudentsModule,
  ],
})
export class AppModule {}
