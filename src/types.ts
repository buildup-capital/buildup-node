export interface AccountOverviewAmountSavedObject {
  amountSaved: number;
  contributionPercentage: number;
  income: number;
}

export interface AccountOverviewInvestmentEarningsObject {
  amountSaved: number;
  annualReturnPercentage: number;
  investmentEarnings: number;
  returnPercentageGraph: ReturnPercentageGraphObject[];
}

export interface AccountOverviewObject {
  amountSaved?: AccountOverviewAmountSavedObject;
  investmentEarnings?: AccountOverviewInvestmentEarningsObject;
  taxesReduction?: AccountOverviewTaxesReductionObject;
  retirementSavings?: AccountOverviewRetirementSavingsObject;
  invalid?: string[];
  missing?: string[];
}

export interface AccountOverviewOptions {
  IRAType: string;
  contributionPercentage: number;
  riskValue: number;
  startDate: number;
  totalIncome: number;
  uid: string;
}

export interface AccountOverviewRetirementSavingsObject {
  amountSaved: number;
}

export interface AccountOverviewTaxesReductionObject {
  amountInvested: number;
}

export interface AccountOverviewResponse {
  data?: AccountOverviewObject;
  datetime: number;
  info: string;
  misc: string;
  request: string;
  status: number;
}

export interface AllocationsDataObject {
  allocations: AllocationsObject;
}

export interface AllocationsObject {
  SPAB: number;
  VEA: number;
  VOO: number;
  VTWO: number;
}

export interface AllocationsOptions {
  riskValue: number;
  uid: string;
}

export interface AllocationsResponse {
  data: AllocationsDataObject;
  datetime: number;
  info: string;
  misc: string;
  request: string;
  status: number;
}

export interface AnswersValues {
  riskGrowth?: number;
  riskLevel: number;
  riskLosses: number;
  riskVolatility: number;
  uid: string;
}

export interface IRATypeObject {
  IRAType: string;
  maxContribution: string | number;
}

export interface IRATypeOptions {
  IRAType: string;
  uid: string;
}

export interface IRATypeResponse {
  data: IRATypeObject;
  datetime: number;
  info: string;
  misc: string;
  request: string;
  status: number;
}

export interface KeyPair {
  key: string;
  secret: string;
}

export interface ReturnPercentageGraphObject {
  date: string;
  returnPercentage: number;
}

export interface RiskValueObject {
  invalid?: string[];
  missing?: string[];
  riskValue?: number | string;
}

export interface RiskValueOptions {
  riskGrowth?: number;
  riskLevel: number;
  riskLosses: number;
  riskVolatility: number;
  uid: string;
}

export interface RiskValueResponse {
  data: RiskValueObject;
  datetime: number;
  info: string;
  misc: string;
  request: string;
  status: number;
}
