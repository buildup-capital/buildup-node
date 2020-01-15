import * as http from 'http';
// TODO: determine if origin uses HTTPS
// import * as https from 'https';

import {
  AccountOverviewData,
  AccountOverviewResponse,
  AllocationsResponse,
  AnswersValues,
  IRATypeResponse,
  KeyPair,
  RiskValueResponse,
} from './types';

export class BuildUp {
  private readonly API_ORIGIN: string = '140.82.22.55';
  private readonly API_PORT: number = 80;

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
    }: AccountOverviewData = accountData;
    if (!(IRAType && contributionPercentage && riskValue && startDate && totalIncome)) {
      throw new Error(`BuildUp: invalid account data provided! Account data object should contain:\n
        IRA Type\n
        Contribution Percentage\n
        Risk Value\n
        Start Date\n
        Total Income
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
   * @param riskValue {number}
   * @returns {Promise<AllocationsResponse>}
   */
  public getAllocations(riskValue: number): Promise<AllocationsResponse> {
    if (!riskValue) {
      throw new Error('BuildUp: Risk Value is required!');
    }
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.API_ORIGIN,
        method: 'GET',
        path: `/api/v1/allocations?riskValue=${riskValue}&${this.getKeyAndSecret()}`,
        port: this.API_PORT,
      };
      const request = this.createHttpRequest(options, resolve);
      request.on('error', (error: Error): void => reject(error));
      request.end();
    });
  }

  /**
   * Get IRA data from the provided IRA type
   * @param IRAType {string}
   * @returns {Promise<IRATypeResponse>}
   */
  public getIRAType(IRAType: string): Promise<IRATypeResponse> {
    if (!IRAType) {
      throw new Error('BuildUp: IRA Type is required!');
    }
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ IRAType });
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
    if (!answers) {
      throw new Error('BuildUp: Risk Answers object is required!');
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
