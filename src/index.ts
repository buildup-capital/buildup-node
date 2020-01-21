import * as http from 'http';
// TODO: determine if origin uses HTTPS
// import * as https from 'https';

import {
  AccountOverviewData,
  AccountOverviewResponse,
  AllocationsData,
  AllocationsResponse,
  AnswersValues,
  IRADataType,
  IRATypeResponse,
  KeyPair,
  RiskValueResponse,
} from './types';

export class BuildUp {
  private readonly API_ORIGIN: string = 'localhost'; // '140.82.22.55';
  private readonly API_PORT: number = 6100; // 80;

  private readonly KEY: string;
  private readonly SECRET: string;

  constructor(keyPair: KeyPair) {
    this.KEY = keyPair.key;
    this.SECRET = keyPair.secret;
  }

  /**
   * Get account overview based on Contribution Percentage, IRA Type, Risk Value, Start Date and Total Income
   * @param accountData {AccountOverviewData} - account overview data
   * @returns {Promise<AccountOverviewResponse>}
   */
  public getAccountOverview(accountData: AccountOverviewData): Promise<AccountOverviewResponse> {
    const {
      IRAType,
      contributionPercentage,
      riskValue,
      startDate,
      totalIncome,
      uid,
    }: AccountOverviewData = accountData;
    if (!(IRAType && contributionPercentage && riskValue && startDate && totalIncome && uid)) {
      throw new Error(`BuildUp: invalid account overview data provided! Account overview data object should contain:\n
        IRA Type\n
        Contribution Percentage\n
        Risk Value\n
        Start Date\n
        Total Income\n
        UID
      `);
    }
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(accountData);
      const options = {
        headers: {
          'Content-Length': data.length,
          'Content-Type': 'application/json',
        },
        hostname: this.API_ORIGIN,
        method: 'POST',
        path: `/api/v1/account-overview?${this.getKeyAndSecret()}`,
        port: this.API_PORT,
      };
      const request = this.createHttpRequest(options, resolve);
      request.on('error', (error: Error): void => reject(error));
      request.write(data);
      request.end();
    });
  }

  /**
   * Get allocations based on the Risk Value
   * @param allocationsData {AllocationsData} - Allocations data, should contain Risk Value and UID
   * @returns {Promise<AllocationsResponse>}
   */
  public getAllocations(allocationsData: AllocationsData): Promise<AllocationsResponse> {
    const { riskValue, uid }: AllocationsData = allocationsData;
    if (!(riskValue && uid)) {
      throw new Error(`BuildUp: invalid Allocations Data provided! Allocations Data object should contain:\n
        Risk Value\n
        UID
      `);
    }
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(allocationsData);
      const options = {
        headers: {
          'Content-Length': data.length,
          'Content-Type': 'application/json',
        },
        hostname: this.API_ORIGIN,
        method: 'POST',
        path: `/api/v1/allocations?${this.getKeyAndSecret()}`,
        port: this.API_PORT,
      };
      const request = this.createHttpRequest(options, resolve);
      request.on('error', (error: Error): void => reject(error));
      request.write(data);
      request.end();
    });
  }

  /**
   * Get IRA data from the provided IRA type
   * @param IRAData {IRADataType} - IRA data, should contain IRA Type and UID
   * @returns {Promise<IRATypeResponse>}
   */
  public getIRAType(IRAData: IRADataType): Promise<IRATypeResponse> {
    if (!(IRAData && IRAData.IRAType && IRAData.uid)) {
      throw new Error(`BuildUp: invalid IRA data provided! IRA data object should contain:\n
        IRA Type\n
        UID
      `);
    }
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(IRAData);
      const options = {
        headers: {
          'Content-Length': data.length,
          'Content-Type': 'application/json',
        },
        hostname: this.API_ORIGIN,
        method: 'POST',
        path: `/api/v1/ira-type?${this.getKeyAndSecret()}`,
        port: this.API_PORT,
      };
      const request = this.createHttpRequest(options, resolve);
      request.on('error', (error: Error): void => reject(error));
      request.write(data);
      request.end();
    });
  }

  /**
   * Get Risk Value based on the Risk Answers
   * @param answers {AnswersValues}
   * @returns {Promise<RiskValueResponse>}
   */
  public getRiskValue(answers: AnswersValues): Promise<RiskValueResponse> {
    const isAnswersValues = answers
      && answers.riskGrowth
      && answers.riskLevel
      && answers.riskLosses
      && answers.riskVolatility
      && answers.uid;

    if (!isAnswersValues) {
      throw new Error(`BuildUp: invalid Answers values data provided! Answers values data object should contain:\n
        riskGrowth\n
        riskLevel\n
        riskLosses\n
        riskVolatility\n
        UID
      `);
    }
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(answers);
      const options = {
        headers: {
          'Content-Length': data.length,
          'Content-Type': 'application/json',
        },
        hostname: this.API_ORIGIN,
        method: 'POST',
        path: `/api/v1/risk-value?${this.getKeyAndSecret()}`,
        port: this.API_PORT,
      };
      const request = this.createHttpRequest(options, resolve);
      request.on('error', (error: Error): void => reject(error));
      request.write(data);
      request.end();
    });
  }

  /**
   * Get key and secret path string
   * @returns {string}
   */
  private getKeyAndSecret(): string {
    return `key=${this.KEY}&secret=${this.SECRET}`;
  }

  /**
   * Create HTTP request
   * @param options {http.RequestOptions} - request options
   * @param resolve {Function} - resolve the Promise
   * @returns {*}
   */
  private createHttpRequest(options: http.RequestOptions, resolve: any) {
    return http.request(options, (response: http.IncomingMessage): void => {
      let data: string = '';
      response.setEncoding('utf8');
      response.on('readable', (): void => {
        const chunk: string = response.read();
        if (chunk !== null) {
          data += chunk;
        }
      });
      response.on('end', () => resolve(JSON.parse(data)));
    });
  }
}
