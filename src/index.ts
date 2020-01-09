import * as http from 'http';
// import * as https from 'https';

import {
    AllocationsResponse,
    IRATypeResponce,
    RiskValueResponce,
    KeyPair,
} from './types';
import {createCipher} from "crypto";

export class BuildUp {
    private readonly API_ORIGIN: string = 'localhost';
    private readonly API_PORT: number = 6100;

    private readonly KEY: string;
    private readonly SECRET: string;

    constructor(keyPair: KeyPair) {
        this.KEY = keyPair.key;
        this.SECRET = keyPair.secret;
    }

    /**
     * Get key and secret path string
     * @returns {string}
     */
    private getKeyAndSecret() {
        return `key=${this.KEY}&secret=${this.SECRET}`;
    }

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
                    .on('error', (error): void => reject(error)),
                );
    }
    public getIRATypes(IRAType: string): Promise<IRATypeResponce> {
        return new Promise((resolve, reject) => {
            const reqData = JSON.stringify({ 'IRAType': IRAType });
            const options = {
                headers: {
                    'Content-Length': Buffer.byteLength(reqData),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                hostname: this.API_ORIGIN,
                method: 'POST',
                path: `/api/v1/ira-type?${this.getKeyAndSecret()}`,
                port: this.API_PORT,
            };

            const request = http.request(options, (response: http.IncomingMessage): void => {
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

            request.on('error', (error: Error): void => reject(error));

            request.write(reqData);
            request.end();
        });
    }
    public getRiskValues(riskGrowth: number, riskLevel: number, riskLosses: number, riskVolatility: number, ): Promise<RiskValueResponce> {
        return new Promise((resolve, reject) => {
            const reqData = JSON.stringify({
                riskGrowth,
                riskLevel,
                riskLosses,
                riskVolatility,
            });
            console.log('reqData', reqData);
            const options = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(reqData),
                },
                hostname: this.API_ORIGIN,
                method: 'POST',
                path: `/api/v1/risk-value?${this.getKeyAndSecret()}`,
                port: this.API_PORT,
            };
            console.log('options', options);
            const request = http.request(options, (response: http.IncomingMessage): void => {
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

            request.on('error', (error: Error): void => reject(error));

            request.write(reqData);
            request.end();
        });
    }
}
