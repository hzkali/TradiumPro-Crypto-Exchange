import { Test } from '@nestjs/testing';
import { setApp } from '../../../src/app/helpers/functions';
import { MainModule } from '../../../src/main.module';

export async function createTestingModule() {
  const moduleBuilder = Test.createTestingModule({
    imports: [MainModule],
  });

  const compiled = await moduleBuilder.compile();

  const app = compiled.createNestApplication(undefined, {
    logger: false,
  });

  setApp(app);

  return await app.init();
}
