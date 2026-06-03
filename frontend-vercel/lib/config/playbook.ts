export interface PlaybookConfig {
  baselineSalesTargets: {
    monthlyRevenueMin: number;
    conversionRateTarget: number;
  };
  performanceMonitoringTriggers: {
    responseTimeSLA: number;
    followUpFrequency: string;
  };
  commissionStructures: {
    standard: number;
    highYield: number;
    bonusThreshold: number;
  };
  responseWindowThresholds: {
    urgent: number;
    standard: number;
  };
}

export const playbookConfig: PlaybookConfig = {
  baselineSalesTargets: {
    monthlyRevenueMin: 1000000,
    conversionRateTarget: 0.15,
  },
  performanceMonitoringTriggers: {
    responseTimeSLA: 300, // seconds (5 minutes)
    followUpFrequency: '48h',
  },
  commissionStructures: {
    standard: 0.02, // 2%
    highYield: 0.035, // 3.5% for scores >= 8
    bonusThreshold: 5000000,
  },
  responseWindowThresholds: {
    urgent: 15, // minutes
    standard: 60, // minutes
  }
};
