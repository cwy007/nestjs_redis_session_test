import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SessionService {
  @Inject(RedisService)
  private readonly redisService: RedisService;

  async setSession(sessionId: string, data: Record<string, string>, ttl: number = 30 * 60): Promise<string> {
    if (!sessionId) {
      sessionId = this.generateSessionId();
    }
    await this.redisService.hashSet(`sid_${sessionId}`, data, ttl);
    return sessionId;
  }

  async getSession<SessionType extends Record<string, string>>(sessionId: string): Promise<SessionType>;
  async getSession(sessionId: string): Promise<Record<string, string>> {
    return this.redisService.hashGet(`sid_${sessionId}`);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.redisService.hashDelete(`sid_${sessionId}`);
  }

  generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
