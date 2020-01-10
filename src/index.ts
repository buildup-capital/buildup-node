import * as http from 'http';
// TODO: determine if origin uses HTTPS
// import * as https from 'https';

import { AllocationsResponse, AnswersValues, IRATypeResponse, KeyPair, RiskValueResponse } from './types';

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
   *
   * @param riskValue {number}
   */
  public getAllocations(riskValue: number): Promise<AllocationsResponse> {
    if (!riskValue) {
      throw new Error('BuildUp: Risk Value is required!');
    }
    return new Promise((resolve, reject) =>
      http
        .get(
          {
            hostname: this.API_ORIGIN,
            method: 'GET',
            path: `/api/v1/allocations?riskValue=${riskValue}&${this.getKeyAndSecret()}`,
            port: this.API_PORT,
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
   *
   * @param IRAType {string}
   */
  public getIRATypes(IRAType: string): Promise<IRATypeResponse> {
    return new Promise((resolve, reject) => {
      const reqData = JSON.stringify({ IRAType });
      const options = {
        headers: {
          'Content-Length': reqData.length,
          'Content-Type': 'application/json',
        },
        hostname: this.API_ORIGIN,
        method: 'POST',
        path: `/api/v1/ira-type?${this.getKeyAndSecret()}`,
        port: this.API_PORT,
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
    return new Promise((resolve, reject) => {
      const reqData = JSON.stringify(answers);
      const options = {
        headers: {
          'Content-Length': reqData.length,
          'Content-Type': 'application/json',
        },
        hostname: this.API_ORIGIN,
        method: 'POST',
        path: `/api/v1/risk-value?${this.getKeyAndSecret()}`,
        port: this.API_PORT,
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
