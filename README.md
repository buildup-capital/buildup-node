## buildup-node

This module provides an access to the BuildUp APIs.

### Installation

```bash
npm install buildup-node
```

### BuildUp API keys

API keys are required for the module to work.

### Usage

Import the module:

```javascript
const { BuildUp } = require('buildup-node');
```

Create a new client instance:

```javascript
const BuildUpClient = new BuildUp({ key: 'API_KEY', secret: 'API_SECRET' });
```

You can now access the provided APIs in your async functions:

```javascript
async function getRiskValue() {
  try {
    /* ... */

    const answers = {
      riskGrowth: 5,
      riskLevel: 2,
      riskLosses: 4,
      riskVolatility: 2,
    };

    const riskValue = await BuildUpClient.getRiskValue(answers);
    console.log(riskValue); // 3.25
  } catch (error) {
    /* ... */
  }
}
```

### Available methods

**getAllocations(riskValue: number)**

This method provides stock allocations based on the Risk Value.

```javascript
const riskValue = 5;

const allocations = await BuildUpClient.getAllocations(riskValue);
```

Method returns an object:
```
{
    SPAB: 10,
    VEA: 30,
    VOO: 30,
    VTWO: 30
}
```

**getIRAType(IRAType: string)**

This method provides maximum contribution amount based on the selected IRA type.

```javascript
const IRAType = 'SEP IRA';

const IRAData = await BuildUpClient.getIRAType(IRAType);
```

Method returns an object:
```
{
    IRAType: 'SEP IRA',
    maxContribution: '15%'
}
```

**getRiskValue(answers: AnswersValues)**

This method provides Risk Value based on the Risk Question answers.

```javascript
const answers = {
  riskGrowth: 5,
  riskLevel: 2,
  riskLosses: 4,
  riskVolatility: 2,
};

const riskValue = await BuildUpClient.getRiskValue(answers);
```

Method returns an object:
```
{
    riskValue: 3.25
}
```
