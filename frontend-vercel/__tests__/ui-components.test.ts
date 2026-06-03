import { extractAnimatedValue, formatAnimatedValue } from '@/components/UI/StatsCard';
import { getLeadScoreTone } from '@/components/UI/LeadScoreBadge';

describe('LeadScoreBadge helpers', () => {
  it('returns a low-priority English label for low scores', () => {
    expect(getLeadScoreTone(3, 'en').label).toBe('Low priority');
  });

  it('returns a VIP Arabic label for high scores', () => {
    expect(getLeadScoreTone(9, 'ar').label).toBe('عميل ذهبي');
  });
});

describe('StatsCard helpers', () => {
  it('extracts numeric values and preserves prefixes and suffixes', () => {
    expect(extractAnimatedValue('$2.8B')).toEqual({
      numericValue: 2.8,
      prefix: '$',
      suffix: 'B',
      decimals: 1,
      useGrouping: false,
    });
  });

  it('formats animated values using extracted metadata', () => {
    const meta = extractAnimatedValue('12,500 EGP');
    expect(formatAnimatedValue(meta, 12500)).toBe('12,500 EGP');
  });
});
