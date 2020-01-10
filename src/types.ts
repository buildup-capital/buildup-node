export interface AllocationsObject {
  SPAB: number;
  VEA: number;
  VOO: number;
  VTWO: number;
}

export interface AllocationsResponse {
  data: AllocationsObject;
  datetime: number;
  info: string;
  misc: string;
  request: string;
  status: number;
}

export interface AnswersValues {
  riskGrowth: number;
  riskLevel: number;
  riskLosses: number;
  riskVolatility: number;
}

export interface IRATypeObject {
  IRAType: string;
  maxContribution: string | number;
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

export interface RiskValueObject {
  riskValue: string;
}

export interface RiskValueResponse {
  data: RiskValueObject;
  datetime: number;
  info: string;
  misc: string;
  request: string;
  status: number;
}
