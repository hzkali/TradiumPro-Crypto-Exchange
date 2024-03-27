import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { app } from '../helpers/functions';

@Injectable()
export class TestQueue {
  constructor(
    @InjectQueue('test')
    private readonly testQueue: Queue,
  ) {}

  async processTestJob1(data: any) {
    try {
      await this.testQueue.add('process_test_job1', {
        ...data,
        action: 'match',
      });
    } catch (e) {
      console.error(e.stack);
    }
  }

  async processTestJob2(data: any) {
    try {
      await this.testQueue.add('process_test_job2', {
        ...data,
        action: 'cancel',
      });
    } catch (e) {
      console.error(e.stack);
    }
  }
}
