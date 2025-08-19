// Type helper that creates an enum from an as const object
export type CreateEnum<T> = T[keyof T];

// Type helper that converts snake_case to camelCase
export type SnakeToCamel<S extends string> =
    S extends `${infer T}_${infer U}` ? `${Lowercase<T>}${Capitalize<SnakeToCamel<U>>}` : Lowercase<S>;
