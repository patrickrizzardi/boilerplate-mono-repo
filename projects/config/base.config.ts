import type {
  EnvConfig,
  EnvConfigToInterface} from "@config/config.utils.ts";
import {
  validateAndInitializeConfig,
} from "@config/config.utils.ts";

type BaseConfig = EnvConfigToInterface<typeof baseEnvConfig>;

const baseEnvConfig = {
  NODE_ENV: { required: true },
  API_URL: { required: true },
  APP_URL: { required: true },
  APP_NAME: { required: true },
} as const satisfies EnvConfig;

export const baseConfig =
  validateAndInitializeConfig<BaseConfig>(baseEnvConfig);
