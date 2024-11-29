import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './app/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './app/user/entity/user.entity';
import { MoviesModule } from './app/movies/movies.module';
import { RentalsModule } from './app/rentals/rentals.module';
import { AuthModule } from './app/auth/auth.module';
import { JwtAuthGuard } from './app/auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: `${process.env.DB_PASSWORD}`,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    TypeOrmModule.forFeature([User]),
    MoviesModule,
    RentalsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
