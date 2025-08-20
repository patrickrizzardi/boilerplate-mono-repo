import type { SnakeToCamel } from "@custom-types/utility-types.ts";

export type EnvConfig = Record<string, { required: boolean }>;

// Type helper that converts ENV keys to interface keys
export type EnvConfigToInterface<T extends EnvConfig> = {
  [K in keyof T as K extends string
    ? T[K] extends { required: false }
      ? SnakeToCamel<K>
      : never
    : never]: string | undefined;
} & {
  [K in keyof T as K extends string ? SnakeToCamel<K> : never]: T[K] extends {
    required: true;
  }
    ? string
    : string | undefined;
};

const getEnvVars = <T = unknown>(
  env: NodeJS.ProcessEnv,
  config: EnvConfig,
): T => {
  const missingVars = Object.entries(config)
    .filter(([key, _config]) => _config.required && !env[key])
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }

  // Build config object with camelCase properties
  const result: Record<string, unknown> = {};

  for (const [envKey, _config] of Object.entries(config)) {
    if (env[envKey]) {
      const camelCaseKey = snakeToCamel(envKey);
      result[camelCaseKey] = env[envKey];
    }
  }

  return result as T;
};

export const validateAndInitializeConfig = <T = unknown>(
  config: EnvConfig,
): T => {
  if (typeof process !== "undefined") {
    return getEnvVars(process.env, config);
  }

  throw new Error("No environment object found");
};

// Helper function to convert SNAKE_CASE to camelCase
const snakeToCamel = (str: string): string =>
  str
    .toLowerCase()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .replace(/_(?<letter>[a-z])/g, (_match, letter) => letter.toUpperCase());
