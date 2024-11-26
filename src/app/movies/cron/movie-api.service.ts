import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MovieApiService {
  constructor(private configService: ConfigService) {}
  private readonly apiUrl = this.configService.get<string>('API_BASE_URL');
  private readonly apiKey = this.configService.get<string>('API_KEY');

  async fetchMovies(): Promise<any[]> {
    try {
      const response = await axios.get(this.apiUrl, {
        params: { api_key: this.apiKey },
      });
      return response.data.results;
    } catch (error) {
      console.log('Error', error);
      throw error;
    }
  }
}
