import { DotenvProvider } from './dotenv-provider';

describe('DotenvProvider', () => {
  it('should be and instance of DotenvProvider', () => {
    expect(new DotenvProvider()).toBeInstanceOf(DotenvProvider);
  });
});
