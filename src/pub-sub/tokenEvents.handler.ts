import { Injectable } from '@nestjs/common';
import { PubSubService } from './pub-sub.service';

@Injectable()
export class ProducerService {
  constructor(private readonly pubSubService: PubSubService) {}

  publishToken(message: string) {
    this.pubSubService.publish('token_created', { message });
  }
}
