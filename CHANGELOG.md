## 1.0.2

1. Added the CHANGELOG.md file.

2. All available methods now take a single argument - an object, that should contain the necessary data.

All argument objects should now contain a `uid` property - a unique user identifier (`string`).

Example:

```javascript
const { BuildUp } = require('buildup-node');
const Client = new BuildUp({ key: 'key', secret: 'secret' });

/* ... */

const allocations = await Client.getAllocations({
  riskValue: 5,
  uid: 'uniqueUserIdentifier',
});
```

3. All available methods now perform a check of the provided argument object.

If there's a problem with the provided object, the module will throw an error.

Example:

```bash
Error: BuildUp: invalid options provided! Options object should contain the following properties:

  riskGrowth

  riskLevel

  riskLosses

  riskVolatility

  uid
```

4. Adjusted the unit tests for all of the methods.

5. Updated the README file.
