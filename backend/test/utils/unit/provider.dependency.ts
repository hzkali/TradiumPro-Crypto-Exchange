import { PrismaService } from '../../../src/libs/prisma/prisma.service';

export function TestProviderDependecy() {
  return [PrismaService];
}
