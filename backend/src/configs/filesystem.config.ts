import { registerAs } from '@nestjs/config';
import { resolve } from 'path';
import { IFilesystemModuleOptions } from '@filesystem/nestjs/interfaces/file-system-module-options';
import { base_url } from '../app/helpers/functions';

export const FilesystemConfig = registerAs(
  'filesystem',
  (): IFilesystemModuleOptions => ({
    default: 'local',
    disks: {
      local: {
        root: resolve('public/storage'),
        adapter: 'local',
        url: `${base_url()}`,
      },
    },
  }),
);
