/* eslint-disable @typescript-eslint/ban-types */
import { AuthenticatableInterface } from '../libs/auth/authenticatable.interface';
import { AuthServiceInterface } from '../libs/auth/interfaces/auth.service.interface';
import { Type } from '@nestjs/common';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

export interface CorsConfig {
  enabled: boolean;
}

export interface UiSection {
  title: string;
  description?: string;
}

export interface SectionSettings {
  category: UiSection;
}

export interface AppConfig {
  timeZone: string;
  port: number;
  env: string;
  emailVerificationEnabled: boolean;
  sections?: SectionSettings;
  sentryDsn: string;
}

interface AuthProvider {
  model: AuthenticatableInterface;
  service: Type<AuthServiceInterface>;
}

export interface AuthConfig {
  default: string;
  providers: {
    [key: string]: AuthProvider;
  };
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  introspection: boolean;
  schemaDestination: string;
  sortSchema: boolean;
  formatError: (error: GraphQLError) => GraphQLFormattedError;
  wsOnConnect?: (context: any) => Promise<any>;
  wsOnDisconnect?: (context: any, code: number, reason: string) => Promise<any>;
}

export interface SmtpConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: string;
}

export interface MailConfig {
  defaultMailer: string;
  mailers: {
    smtp: SmtpConfig;
    // log: FileTransportOptions;
  };
  from: {
    address: string;
    name: string;
  };
}

export interface CacheConfigInterface {
  host: string;
  port: number;
  username: string;
  password: string;
  db: number;
  ttl: number;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
  accessSecret: string;
  refreshSecret: string;
}
