import { checkSafety } from './safety';

describe('Safety Module', () => {
  test('should flag rm -rf / as dangerous', () => {
    const result = checkSafety('rm -rf /');
    expect(result.level).toBe('dangerous');
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  test('should flag rm -rf as moderate', () => {
    const result = checkSafety('rm -rf node_modules');
    expect(result.level).toBe('moderate');
  });

  test('should allow safe commands', () => {
    const result = checkSafety('ls -la');
    expect(result.level).toBe('safe');
    expect(result.warnings).toHaveLength(0);
  });

  test('should flag sudo commands', () => {
    const result = checkSafety('sudo apt update');
    expect(result.level).toBe('moderate');
    expect(result.warnings.some((w) => w.includes('管理员'))).toBe(true);
  });
});
