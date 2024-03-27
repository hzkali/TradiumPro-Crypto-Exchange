import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { newConsole } from '../../../libs/log/log.service';
import { sleep } from '../../helpers/functions';

// eslint-disable-next-line @typescript-eslint/no-var-requires

@Processor('test')
export class TestProcessor {
  @Process('process_test_job1')
  async processTestJob1(job: Job) {
    try {
      console.log('process_test_job1');
      console.log('job start');
      newConsole.log(job.data);
      if (job.data.action == 'match') {
        console.log(`action: match`);
      } else if (job.data.action == 'cancel') {
        console.log(`action: cancel`);
      } else {
        console.log('action: N/A');
      }
      console.log('job end\n');

      await sleep(5000);
    } catch (error) {
      console.error(error.stack);
      throw error;
    }
  }

  @Process('process_test_job2')
  async processTestJob2(job: Job) {
    try {
      console.log('process_test_job2');
      console.log('job start');
      newConsole.log(job.data);
      if (job.data.action == 'match') {
        console.log(`action: match`);
      } else if (job.data.action == 'cancel') {
        console.log(`action: cancel`);
      } else {
        console.log('action: N/A');
      }
      console.log('job end\n');
      await sleep(6000);
    } catch (error) {
      console.error(error.stack);
      throw error;
    }
  }
}
