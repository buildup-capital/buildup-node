import * as http from 'http';
// TODO: determine if origin uses HTTPS
// import * as https from 'https';

import {
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
  private readonly LOCAL_API_ORIGIN: string = 'localhost';
  private readonly LOCAL_API_PORT: number = 6100;

  private readonly KEY: string;
  private readonly SECRET: string;

  constructor(keyPair: KeyPair) {
    this.KEY = keyPair.key;
    this.SECRET = keyPair.secret;
  }

  /**
   * Get account overview based on Contribution Percentage, IRA Type, Risk Value, Total Income and Start Date
   * @param contributionPercentage {number}
   * @param IRAType {string}
   * @param riskValue {number}
   * @param totalIncome {number}
   * @param startDate {number}
   * @returns {Promise<AccountOverviewResponse>}
   */
  public getAccountOverview(
      contributionPercentage: number,
      IRAType: string,
      riskValue: number,
      totalIncome: number,
      startDate: number,
      ): Promise<AccountOverviewResponse> {
    if (!(contributionPercentage && IRAType && riskValue && totalIncome && startDate)) {
      throw new Error(
          `BuildUp: 
          ${!contributionPercentage ? 'Contribution Percentage, ' : ''}
          ${!IRAType ? 'IRA Type, ': ''}
          ${!riskValue ? 'Risk Value, ': ''}
          ${!totalIncome ? 'Total Income, ': ''}
          ${!startDate ? 'Start Date ': ''}is required!`);
    }
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        contributionPercentage,
        IRAType,
        riskValue,
        totalIncome,
        startDate,
      });
      const options = {
        headers: {
          'Content-Length': data.length,
          'Content-Type': 'application/json',
        },
        hostname: this.LOCAL_API_ORIGIN,
        method: 'POST',
        path: `/api/v1/account-overview?${this.getKeyAndSecret()}`,
        port: this.LOCAL_API_PORT,
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
    return new Promise((resolve, reject) =>
      http
        .get(
          {
            hostname: this.LOCAL_API_ORIGIN,
            method: 'GET',
            path: `/api/v1/allocations?riskValue=${riskValue}&${this.getKeyAndSecret()}`,
            port: this.LOCAL_API_PORT,
          },
          (response: http.IncomingMessage): void => {
            let data: string = '';
            response.setEncoding('utf8');
            response.on('readable', (): void => {
              const chunk: string = response.read();
              if (chunk !== null) {
                data += chunk;
              }
            });
            response.on('end', () => {
              return resolve(JSON.parse(data));
            });
          },
        )
        .on('error', (error: Error): void => reject(error)),
    );
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
      const reqData = JSON.stringify({ IRAType });
      const options = {
        headers: {
          'Content-Length': reqData.length,
          'Content-Type': 'application/json',
        },
        hostname: this.LOCAL_API_ORIGIN,
        method: 'POST',
        path: `/api/v1/ira-type?${this.getKeyAndSecret()}`,
        port: this.LOCAL_API_PORT,
      };
      const request = this.createHttpRequest(options, resolve);
      request.on('error', (error: Error): void => reject(error));
      request.write(reqData);
      request.end();
    });
  }

  /**
   *
   * @param answers {AnswersValues}
   */
  public async getRiskValue(answers: AnswersValues): Promise<RiskValueResponse> {
    if (!answers) {
      throw new Error('BuildUp: Answers is required!');
    }
    return new Promise((resolve, reject) => {
      const reqData = JSON.stringify(answers);
      const options = {
        headers: {
          'Content-Length': reqData.length,
          'Content-Type': 'application/json',
        },
        hostname: this.LOCAL_API_ORIGIN,
        method: 'POST',
        path: `/api/v1/risk-value?${this.getKeyAndSecret()}`,
        port: this.LOCAL_API_PORT,
      };
      const request = this.createHttpRequest(options, resolve);
      request.on('error', (error: Error): void => reject(error));
      request.write(reqData);
      request.end();
    });
  }

  /**
   * Get key and secret path string
   * @returns {string}
   */
  private getKeyAndSecret() {
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
      response.on('end', () => {
        return resolve(JSON.parse(data));
      });
    });
  }
}
