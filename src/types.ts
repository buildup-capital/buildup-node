export interface AllocationsObject {
    SPAB: number;
    VEA: number;
    VOO: number;
    VTWO: number;
}

export interface AllocationsResponse {
    data: AllocationsObject,
    datetime: number;
    info: string;
    misc: string;
    request: string;
    status: number;
}

export interface IRATypeObject {
    IRAType: string;
    maxContribution: number;
}
export interface IRATypeResponce {
    data: IRATypeObject,
    datetime: number;
    info: string;
    misc: string;
    request: string;
    status: number;
}
export interface RiskValueObject {
    riskValue: string;
}
export interface RiskValueResponce {
    data: RiskValueObject,
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
