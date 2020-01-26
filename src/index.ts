import * as http from 'http';
// TODO: determine if origin uses HTTPS
// import * as https from 'https';

import {
  AccountOverviewOptions,
  AccountOverviewResponse,
  AllocationsOptions,
  AllocationsResponse,
  IRATypeOptions,
  IRATypeResponse,
  KeyPair,
  RiskValueOptions,
  RiskValueResponse,
} from './types';

const cr = 'BuildUp: invalid options provided! Options object should contain the following properties:\n';

export class BuildUp {
  private readonly API_ORIGIN: string = '140.82.22.55';
  private readonly API_PORT: number = 80;

  private readonly FAILED_CHECK_ERROR = cr;

  private readonly KEY: string;
  private readonly SECRET: string;

  constructor(keyPair: KeyPair) {
    this.KEY = keyPair.key;
    this.SECRET = keyPair.secret;
  }

  /**
   * Get Account Overview based on Contribution Percentage, IRA Type, Risk Value, Start Date and Total Income
   * @param options {AccountOverviewOptions} - options object, should contain the necessary data and UID
   * @returns {Promise<AccountOverviewResponse>}
   */
  public getAccountOverview(options: AccountOverviewOptions): Promise<AccountOverviewResponse> {
    const { IRAType, contributionPercentage, riskValue, startDate, totalIncome, uid }: AccountOverviewOptions = options;
    if (!(IRAType && contributionPercentage && riskValue && startDate && totalIncome && uid)) {
      throw new Error(`${this.FAILED_CHECK_ERROR}
        IRAType\n
        contributionPercentage\n
        riskValue\n
        startDate\n
        totalIncome\n
        uid
      `);
    }
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(options);
      const requestOptions = {
        headers: {
          'Content-Length': data.length,
          'Content-Type': 'application/json',
        },
        hostname: this.API_ORIGIN,
        method: 'POST',
        path: `/api/v1/account-overview?${this.getKeyAndSecret()}`,
        port: this.API_PORT,
      };
      const request = this.createHttpRequest(requestOptions, resolve);
      request.on('error', (error: Error): void => reject(error));
      request.write(data);
      request.end();
    });
  }

  /**
   * Get Allocations based on the Risk Value
   * @param options {AllocationsOptions} - options object, should contain Risk Value and UID
   * @returns {Promise<AllocationsResponse>}
   */
  public getAllocations(options: AllocationsOptions): Promise<AllocationsResponse> {
    if (!(options && options.riskValue && options.uid)) {
      throw new Error(`${this.FAILED_CHECK_ERROR}
        riskValue\n
        uid
      `);
    }
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(options);
      const requestOptions = {
        headers: {
          'Content-Length': data.length,
          'Content-Type': 'application/json',
        },
        hostname: this.API_ORIGIN,
        method: 'POST',
        path: `/api/v1/allocations?${this.getKeyAndSecret()}`,
        port: this.API_PORT,
      };
      const request = this.createHttpRequest(requestOptions, resolve);
      request.on('error', (error: Error): void => reject(error));
      request.write(data);
      request.end();
    });
  }

  /**
   * Get IRA data from the provided IRA type
   * @param options {IRATypeOptions} - options object, should contain IRA Type and UID
   * @returns {Promise<IRATypeResponse>}
   */
  public getIRAType(options: IRATypeOptions): Promise<IRATypeResponse> {
    if (!(options && options.IRAType && options.uid)) {
      throw new Error(`${this.FAILED_CHECK_ERROR}
        IRAType\n
        uid
      `);
    }
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(options);
      const requestOptions = {
        headers: {
          'Content-Length': data.length,
          'Content-Type': 'application/json',
        },
        hostname: this.API_ORIGIN,
        method: 'POST',
        path: `/api/v1/ira-type?${this.getKeyAndSecret()}`,
        port: this.API_PORT,
      };
      const request = this.createHttpRequest(requestOptions, resolve);
      request.on('error', (error: Error): void => reject(error));
      request.write(data);
      request.end();
    });
  }

  /**
   * Get Risk Value based on the Risk Answers
   * @param options {RiskValueOptions} - options object, should contain Risk Answers and UID
   * @returns {Promise<RiskValueResponse>}
   */
  public getRiskValue(options: RiskValueOptions): Promise<RiskValueResponse> {
    const checkValues =
      options && options.riskGrowth && options.riskLevel && options.riskLosses && options.riskVolatility && options.uid;
    if (!checkValues) {
      throw new Error(`${this.FAILED_CHECK_ERROR}
        riskGrowth\n
        riskLevel\n
        riskLosses\n
        riskVolatility\n
        uid
      `);
    }
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(options);
      const requestOptions = {
        headers: {
          'Content-Length': data.length,
          'Content-Type': 'application/json',
        },
        hostname: this.API_ORIGIN,
        method: 'POST',
        path: `/api/v1/risk-value?${this.getKeyAndSecret()}`,
        port: this.API_PORT,
      };
      const request = this.createHttpRequest(requestOptions, resolve);
      request.on('error', (error: Error): void => reject(error));
      request.write(data);
      request.end();
    });
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

  /**
   * Get key and secret path string
   * @returns {string}
   */
  private getKeyAndSecret(): string {
    return `key=${this.KEY}&secret=${this.SECRET}`;
  }
}
