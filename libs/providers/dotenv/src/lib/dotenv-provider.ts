import {
  EvaluationContext,
  Provider,
  JsonValue,
  ResolutionDetails,
  FlagValueType,
  StandardResolutionReasons,
} from '@openfeature/js-sdk';
import { config, DotenvConfigOptions } from 'dotenv';
import { FlagType } from './flag-type';
import { TypeProcessor } from './type-processor';
import { StringNameToType } from './types';

export class DotenvProvider implements Provider {
  metadata = {
    name: DotenvProvider.name,
  };

  hooks = [];

  private static readonly typeProcessor = new TypeProcessor();

  private static initialConfig?: string;

  public static initialize(options?: DotenvConfigOptions): void {
    const newConfig = JSON.stringify(options);
    if (newConfig === DotenvProvider.initialConfig) {
      return;
    }

    DotenvProvider.initialConfig = newConfig;

    // TODO: Throw exceptions for errors?
    config(options);
  }

  constructor(options?: DotenvConfigOptions) {
    DotenvProvider.initialize(options);
  }

  resolveBooleanEvaluation(
    flagKey: string,
    defaultValue: boolean,
    _context: EvaluationContext
  ): Promise<ResolutionDetails<boolean>> {
    return this.resolveValue(FlagType.BOOLEAN, flagKey, defaultValue);
  }

  resolveStringEvaluation(
    flagKey: string,
    defaultValue: string,
    _context: EvaluationContext
  ): Promise<ResolutionDetails<string>> {
    return this.resolveValue(FlagType.STRING, flagKey, defaultValue);
  }

  resolveNumberEvaluation(
    flagKey: string,
    defaultValue: number,
    _context: EvaluationContext
  ): Promise<ResolutionDetails<number>> {
    return this.resolveValue(FlagType.NUMBER, flagKey, defaultValue);
  }

  resolveObjectEvaluation<U extends JsonValue>(
    flagKey: string,
    defaultValue: U,
    _context: EvaluationContext
  ): Promise<ResolutionDetails<U>> {
    return this.resolveValue(FlagType.OBJECT, flagKey, defaultValue) as Promise<ResolutionDetails<U>>;
  }

  private resolveValue<T extends FlagValueType>(
    flagType: T,
    flagKey: string,
    defaultValue: StringNameToType<T>
  ): Promise<ResolutionDetails<StringNameToType<T>>> {
    return Promise.resolve(this.safelyResolveValue(flagType, flagKey, defaultValue));
  }

  private safelyResolveValue<T extends FlagValueType>(
    flagType: T,
    flagKey: string,
    defaultValue: StringNameToType<T>
  ): Pick<ResolutionDetails<StringNameToType<T>>, 'value' | 'reason'> {
    try {
      const rawValue = process.env[flagKey];

      if (typeof rawValue === 'undefined') {
        return {
          value: defaultValue,
          reason: StandardResolutionReasons.DEFAULT,
        };
      }

      const processedValue = DotenvProvider.typeProcessor[flagType](rawValue) as StringNameToType<T>;

      return {
        value: processedValue,
        reason: StandardResolutionReasons.TARGETING_MATCH,
      };
    } catch (err) {
      return {
        value: defaultValue,
        reason: StandardResolutionReasons.UNKNOWN,
      };
    }
  }
}
