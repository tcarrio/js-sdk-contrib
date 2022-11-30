import { DotenvConfigOptions } from "dotenv";

export function standardizeOptions(options?: DotenvConfigOptions) {
  return options;
}

export function serializeOptions(options?: DotenvConfigOptions) {
  return JSON.stringify(options);
}