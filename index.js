const http = require('http');
const https = require('https');

const { ENDPOINTS, ORIGIN, PORT } = require('./config');

module.exports = class BuildUp {
  #key;
  #secret;

  /**
   * Create an instance with private properties
   * @param key
   * @param secret
   */
  constructor(key = '', secret = '') {
    if (!(key && secret)) {
      throw new Error('BuildUp: API key and API secret are required!');
    }
    this.#key = key;
    this.#secret = secret;
  }

  /**
   * Get key and secret path string
   * @returns {string}
   */
  getKeyAndSecret() {
    return `key=${this.#key}&secret=${this.#secret}`;
  }

  getAllocations(riskValue = null) {
    if (!riskValue) {
      throw new Error('BuildUp: Risk Value is required!');
    }

    // request options
    const options = {
      hostname: ORIGIN,
      method: 'GET',
      path: `${ENDPOINTS.GET_ALLOCATIONS}?riskValue=${riskValue}&${this.getKeyAndSecret()}`,
      port: PORT,
    };

    console.log('-- opts', options);

    // return the Promise
    return new Promise((resolve, reject) => http.get(options, (response = {}) => {
        let data = '';


        response.setEncoding('utf8');
        // console.log(response.ClientResponse, Object.keys(response));

        response.on('data', (chunk) => {
          console.log('-- got data', chunk);
          data += chunk;
        });

        response.on('end', () => {
          console.log('Body: ', data);
          return resolve(data);
        });

      }).on("error", (err) => {
        console.log("Error: ", err.message);
        return reject(new Error(err.message));
      }));
  }
};
