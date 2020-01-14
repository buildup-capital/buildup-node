import { keys, localKeys } from '../../keys';
import { BuildUp } from '../index';
import {
    AccountOverviewResponse,
    AllocationsResponse,
    IRATypeResponse,
    RiskValueResponse,
} from '../types';

const Client = new BuildUp(localKeys);

test('Check class instance', () => expect(Client instanceof BuildUp).toBe(true));

test('Load allocation', async () => {
    const allocations: AllocationsResponse = await Client.getAllocations(5);
    expect (allocations.data.SPAB).toBe(10);
    expect (allocations.data.VEA).toBe(30);
    expect (allocations.data.VOO).toBe(30);
    expect (allocations.data.VTWO).toBe(30);
});

test('Load allocation', async () => {
    const allocations: AllocationsResponse = await Client.getAllocations(3);
    expect (allocations.data.SPAB).toBe(20);
    expect (allocations.data.VEA).toBe(27);
    expect (allocations.data.VOO).toBe(27);
    expect (allocations.data.VTWO).toBe(26);
});

test('Load allocation invalid error', async () => {
    const allocations: AllocationsResponse = await Client.getAllocations(900);
    expect (allocations.info).toBe('INVALID_RISK_VALUE');
});

test('Load riskValue', async () => {
    const answers = {
        riskGrowth: 5,
        riskLevel: 2,
        riskLosses: 4,
        riskVolatility: 2,
    };
    const riskValue: RiskValueResponse = await Client.getRiskValue(answers);
    expect (riskValue.data.riskValue).toBe(3.25);
});

test('Load riskValue', async () => {
    const answers = {
        riskGrowth: 5,
        riskLevel: 4,
        riskLosses: 4,
        riskVolatility: 5,
    };
    const riskValue: RiskValueResponse = await Client.getRiskValue(answers);
    expect (riskValue.data.riskValue).toBe(4.5);
});

test('Load riskValue invalid error', async () => {
    const answers = {
        riskGrowth: 500,
        riskLevel: 4,
        riskLosses: 4,
        riskVolatility: 5,
    };
    const riskValue: RiskValueResponse = await Client.getRiskValue(answers);
    expect (riskValue.data.invalid[0]).toBe('riskGrowth');
});

test('Load riskValue missing error', async () => {
    const answers = {
        riskGrowth: 5,
        riskLevel: 2,
        riskLosses: 4,
    };
    const riskValueError: RiskValueResponse = await Client.getRiskValue(answers);
    expect (riskValueError.data.missing[0]).toBe('riskVolatility');
});

test('Load maximum contribution for SEP IRA Type', async () => {
    const IRAType: IRATypeResponse = await Client.getIRAType('SEP IRA');
    expect (IRAType.data.IRAType).toBe('SEP IRA');
    expect (IRAType.data.maxContribution).toBe('15%');
});

test('Load maximum contribution for Traditional IRA Type', async () => {
    const IRAType: IRATypeResponse = await Client.getIRAType('Traditional IRA');
    expect (IRAType.data.IRAType).toBe('Traditional IRA');
    expect (IRAType.data.maxContribution).toBe(6000);
});

test('Load maximum contribution for Roth IRA Type', async () => {
    const IRAType: IRATypeResponse = await Client.getIRAType('Roth IRA');
    expect (IRAType.data.IRAType).toBe('Roth IRA');
    expect (IRAType.data.maxContribution).toBe(6000);
});

test('Load maximum contribution invalid error', async () => {
    const IRAType: IRATypeResponse = await Client.getIRAType('Invalid string');
    expect (IRAType.info).toBe('INVALID_IRA_TYPE');
});

test('Load account overview', async () => {
    const accountOverview: AccountOverviewResponse = await Client.getAccountOverview(5, 'SEP IRA', 4, 15000, 1578988351);
    expect (accountOverview.data.amountSaved.amountSaved).toBe(750);
    expect (accountOverview.data.amountSaved.contributionPercentage).toBe(5);
    expect (accountOverview.data.amountSaved.income).toBe(15000);
    expect (accountOverview.data.investmentEarnings.amountSaved).toBe(750);
    expect (!!accountOverview.data.investmentEarnings.annualReturnPercentage).toBe(true);
    expect (!!accountOverview.data.investmentEarnings.investmentEarnings).toBe(true);
    expect (!!accountOverview.data.investmentEarnings.returnPercentageGraph.length).toBe(true);
    expect (accountOverview.data.taxesReduction.amountInvested).toBe(750);
    expect (accountOverview.data.retirementSavings.amountSaved).toBe(2250);
});

test('Load account overview', async () => {
    const accountOverview: AccountOverviewResponse = await Client.getAccountOverview(10, 'Traditional IRA', 5, 20000, 1578988351);
    expect (accountOverview.data.amountSaved.amountSaved).toBe(2000);
    expect (accountOverview.data.amountSaved.contributionPercentage).toBe(10);
    expect (accountOverview.data.amountSaved.income).toBe(20000);
    expect (accountOverview.data.investmentEarnings.amountSaved).toBe(2000);
    expect (!!accountOverview.data.investmentEarnings.annualReturnPercentage).toBe(true);
    expect (!!accountOverview.data.investmentEarnings.investmentEarnings).toBe(true);
    expect (!!accountOverview.data.investmentEarnings.returnPercentageGraph.length).toBe(true);
    expect (accountOverview.data.taxesReduction.amountInvested).toBe(2000);
    expect (accountOverview.data.retirementSavings.amountSaved).toBe(6000);
});

test('Load account overview invalid IRA Type error', async () => {
    const accountOverview: AccountOverviewResponse = await Client.getAccountOverview(10, 'Invalid string', 5, 20000, 1578988351);
    expect (accountOverview.info).toBe('INVALID_IRA_TYPE');
});

test('Load account overview invalid Risk Value error', async () => {
    const accountOverview: AccountOverviewResponse = await Client.getAccountOverview(10, 'SEP IRA', 8, 20000, 1578988351);
    expect (accountOverview.info).toBe('INVALID_RISK_VALUE');
});
