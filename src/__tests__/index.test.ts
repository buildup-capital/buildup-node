import { keys } from '../../keys';
import { BuildUp } from '../index';
import {
  AccountOverviewOptions,
  AccountOverviewResponse,
  AllocationsOptions,
  AllocationsResponse,
  IRATypeOptions,
  IRATypeResponse,
  RiskValueOptions,
  RiskValueResponse,
} from '../types';

const Client = new BuildUp(keys);
const uid = 'test123';

test('Check client instance', () => expect(Client instanceof BuildUp).toBe(true));

test('Load allocations with Risk Value equal to 5', async () => {
  const options: AllocationsOptions = {
    riskValue: 5,
    uid,
  };
  const allocations: AllocationsResponse = await Client.getAllocations(options);
  expect(allocations.data.allocations.SPAB).toBe(10);
  expect(allocations.data.allocations.VEA).toBe(30);
  expect(allocations.data.allocations.VOO).toBe(30);
  expect(allocations.data.allocations.VTWO).toBe(30);
});

test('Load allocations with Risk Value equal to 3', async () => {
  const options: AllocationsOptions = {
    riskValue: 3,
    uid,
  };
  const allocations: AllocationsResponse = await Client.getAllocations(options);
  expect(allocations.data.allocations.SPAB).toBe(20);
  expect(allocations.data.allocations.VEA).toBe(27);
  expect(allocations.data.allocations.VOO).toBe(27);
  expect(allocations.data.allocations.VTWO).toBe(26);
});

test('Load allocations: invalid Risk Value', async () => {
  const options: AllocationsOptions = {
    riskValue: 900,
    uid,
  };
  const allocations: AllocationsResponse = await Client.getAllocations(options);
  expect(allocations.info).toBe('INVALID_RISK_VALUE');
});

test('Load Risk Value', async () => {
  const options: RiskValueOptions = {
    riskGrowth: 5,
    riskLevel: 2,
    riskLosses: 4,
    riskVolatility: 2,
    uid,
  };
  const riskValue: RiskValueResponse = await Client.getRiskValue(options);
  expect(riskValue.data.riskValue).toBe(3.25);
});

test('Load Risk Value', async () => {
  const options: RiskValueOptions = {
    riskGrowth: 5,
    riskLevel: 4,
    riskLosses: 4,
    riskVolatility: 5,
    uid,
  };
  const riskValue: RiskValueResponse = await Client.getRiskValue(options);
  expect(riskValue.data.riskValue).toBe(4.5);
});

test('Load Risk Value: invalid Risk Answer provided', async () => {
  const options: RiskValueOptions = {
    riskGrowth: 500,
    riskLevel: 4,
    riskLosses: 4,
    riskVolatility: 5,
    uid,
  };
  const riskValue: RiskValueResponse = await Client.getRiskValue(options);
  expect(riskValue.data.invalid[0]).toBe('riskGrowth');
});

test('Load maximum contribution for SEP IRA Type', async () => {
  const options: IRATypeOptions = {
    IRAType: 'SEP IRA',
    uid,
  };
  const IRAType: IRATypeResponse = await Client.getIRAType(options);
  expect(IRAType.data.IRAType).toBe('SEP IRA');
  expect(IRAType.data.maxContribution).toBe('15%');
});

test('Load maximum contribution for Traditional IRA Type', async () => {
  const options: IRATypeOptions = {
    IRAType: 'Traditional IRA',
    uid,
  };
  const IRAType: IRATypeResponse = await Client.getIRAType(options);
  expect(IRAType.data.IRAType).toBe('Traditional IRA');
  expect(IRAType.data.maxContribution).toBe(6000);
});

test('Load maximum contribution for Roth IRA Type', async () => {
  const options: IRATypeOptions = {
    IRAType: 'Roth IRA',
    uid,
  };
  const IRAType: IRATypeResponse = await Client.getIRAType(options);
  expect(IRAType.data.IRAType).toBe('Roth IRA');
  expect(IRAType.data.maxContribution).toBe(6000);
});

test('Load maximum contribution: invalid IRA type provided', async () => {
  const options: IRATypeOptions = {
    IRAType: 'Invalid string',
    uid,
  };
  const IRAType: IRATypeResponse = await Client.getIRAType(options);
  expect(IRAType.info).toBe('INVALID_IRA_TYPE');
});

test('Load Account Overview data', async () => {
  const options: AccountOverviewOptions = {
    IRAType: 'SEP IRA',
    contributionPercentage: 5,
    riskValue: 4,
    startDate: 1578988351,
    totalIncome: 15000,
    uid,
  };
  const accountOverview: AccountOverviewResponse = await Client.getAccountOverview(options);
  expect(accountOverview.data.amountSaved.amountSaved).toBe(750);
  expect(accountOverview.data.amountSaved.contributionPercentage).toBe(5);
  expect(accountOverview.data.amountSaved.income).toBe(15000);
  expect(accountOverview.data.investmentEarnings.amountSaved).toBe(750);
  expect(!!accountOverview.data.investmentEarnings.annualReturnPercentage).toBe(true);
  expect(!!accountOverview.data.investmentEarnings.investmentEarnings).toBe(true);
  expect(!!accountOverview.data.investmentEarnings.returnPercentageGraph.length).toBe(true);
  expect(accountOverview.data.taxesReduction.amountInvested).toBe(750);
  expect(accountOverview.data.retirementSavings.amountSaved).toBe(2250);
});

test('Load Account Overview data', async () => {
  const options: AccountOverviewOptions = {
    IRAType: 'Traditional IRA',
    contributionPercentage: 10,
    riskValue: 5,
    startDate: 1578988351,
    totalIncome: 20000,
    uid,
  };
  const accountOverview: AccountOverviewResponse = await Client.getAccountOverview(options);
  expect(accountOverview.data.amountSaved.amountSaved).toBe(2000);
  expect(accountOverview.data.amountSaved.contributionPercentage).toBe(10);
  expect(accountOverview.data.amountSaved.income).toBe(20000);
  expect(accountOverview.data.investmentEarnings.amountSaved).toBe(2000);
  expect(!!accountOverview.data.investmentEarnings.annualReturnPercentage).toBe(true);
  expect(!!accountOverview.data.investmentEarnings.investmentEarnings).toBe(true);
  expect(!!accountOverview.data.investmentEarnings.returnPercentageGraph.length).toBe(true);
  expect(accountOverview.data.taxesReduction.amountInvested).toBe(2000);
  expect(accountOverview.data.retirementSavings.amountSaved).toBe(6000);
});

test('Load Account Overview data: invalid IRA Type provided', async () => {
  const options: AccountOverviewOptions = {
    IRAType: 'Invalid string',
    contributionPercentage: 10,
    riskValue: 5,
    startDate: 1578988351,
    totalIncome: 20000,
    uid,
  };
  const accountOverview: AccountOverviewResponse = await Client.getAccountOverview(options);
  expect(accountOverview.info).toBe('INVALID_IRA_TYPE');
});

test('Load Account Overview data: invalid Risk Value provided', async () => {
  const options: AccountOverviewOptions = {
    IRAType: 'SEP IRA',
    contributionPercentage: 10,
    riskValue: 8,
    startDate: 1578988351,
    totalIncome: 20000,
    uid,
  };
  const accountOverview: AccountOverviewResponse = await Client.getAccountOverview(options);
  expect(accountOverview.info).toBe('INVALID_RISK_VALUE');
});
