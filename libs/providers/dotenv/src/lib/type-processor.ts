import { FlagValueType, JsonValue } from "@openfeature/js-sdk";
import { StringNameToType } from "./types";

export class TypeProcessor implements Processor<FlagValueType> {
  boolean(value: string): boolean {
    switch (value.toLowerCase()) {
      case "true":
      case "on":
      case "yes":
        return true;

      default:
        return false;
    }
  }

  string(value: string): string {
    return value;
  }

  number(value: string): number {
    return parseFloat(value);
  }

  object(value: string): JsonValue {
    return JSON.parse(value);
  }
}

type Processor<K extends string> = Record<K, (value: string) => StringNameToType<K>>