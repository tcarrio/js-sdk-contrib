import { JsonValue } from "@openfeature/js-sdk";

export type StringNameToType<T extends string> = T extends 'number' ? number : T extends 'string' ? string : T extends 'boolean' ? boolean : T extends 'object' ? JsonValue : never;