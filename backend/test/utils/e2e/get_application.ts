import { INestApplication } from '@nestjs/common';

import { createTestingModule } from './create_testing_module';

let app: INestApplication;

export async function getApplication() {
  checkTestEnvs();
  if (!app) {
    app = await createTestingModule();
  }

  return app;
}

function checkTestEnvs() {
  if (!process.env.BASE_PROJECT_PATH) {
    throw new Error('BASE_PROJECT_PATH env value missing');
  }
}
