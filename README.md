## buildup-node

This module provides an access to the BuildUp APIs.

### Installation

```bash
npm install buildup-node
```

### BuildUp API keys

API keys are required for the module to work.

Please [contact the developer](https://github.com/peterdee) to get more infomation regarding the API keys.

### Usage

Import the module:

```javascript
const { BuildUp } = require('buildup-node');
```

Create a new client instance:

```javascript
const BuildUpClient = new BuildUp({
  key: 'API_KEY',
  secret: 'API_SECRET',
});
```

You can now access the provided APIs in your async functions.

Please notice: all of the requests should contain `uid` - a unique user identifier (`string`).

```javascript
async function getRiskValue() {
  try {
    /* ... */

    const options = {
      riskGrowth: 5,
      riskLevel: 2,
      riskLosses: 4,
      riskVolatility: 2,
    };

    // add a user identifier to the options
    options.uid = User.identifier; // 'someUniqueIdentifierString'

    const riskValue = await BuildUpClient.getRiskValue(options);
    console.log(riskValue); // 3.25
  } catch (error) {
    /* ... */
  }
}
```

### Available methods

**getAccountOverview(options: AccountOverviewOptions)**

This method provides Account Overview data based on the provided account data.

```javascript
const options = { 
  IRAType: 'SEP IRA',
  contributionPercentage: 5,
  riskValue: 4,
  startDate: 1578988351,
  totalIncome: 15000,
};

// add a user identifier to the options
options.uid = User.identifier;

const accountOverview = await BuildUpClient.getAccountOverview(options);
```

Options:

- `IRAType` - selected IRA Type (`string`)
- `comtributionPercentage` - user's Contribution Percentage (`number`)
- `riskValue` - calculated Risk Value (`number`)
- `startDate` - a start date timestamp (10 digits, seconds) (`number`)
- `totalIncome` - calculated Total Income (`number`)

Method returns an object:
```
{
  amountSaved: {
    amountSaved: 2000,
    contributionPercentage: 10,
    income: 20000
  },
  investmentEarnings: {
    amountSaved: 2000,
    annualReturnPercentage: 13.67,
    investmentEarnings: 273.5,
    returnPercentageGraph: [
         { date: 'Dec 18', returnPercentage: -8.38 },
         { date: 'Jan 19', returnPercentage: 8.16 },
         { date: 'Feb 19', returnPercentage: 3.18 },
         { date: 'Mar 19', returnPercentage: -0.03 },
         { date: 'Apr 19', returnPercentage: 3.06 },
         { date: 'May 19', returnPercentage: -5.65 },
         { date: 'Jun 19', returnPercentage: 5.39 },
         { date: 'Jul 19', returnPercentage: 0.06 },
         { date: 'Aug 19', returnPercentage: -2.31 },
         { date: 'Sep 19', returnPercentage: 1.62 },
         { date: 'Oct 19', returnPercentage: 2.42 },
         { date: 'Nov 19', returnPercentage: 2.69 },
         { date: 'Dec 19', returnPercentage: 2.33 }
    ]
  },
  taxesReduction: { amountInvested: 2000 },
  retirementSavings: { amountSaved: 3000 }
}
```

**getAllocations(options: AllocationsOptions)**

This method provides stock allocations based on the Risk Value.

```javascript
const options = {
  riskValue: 5,
};

// add a user identifier to the options
options.uid = User.identifier;

const allocations = await BuildUpClient.getAllocations(options);
```

Options:

- `riskValue` - calculated Risk Value (`number`)

Method returns an object:
```
{
  allocations: {
    SPAB: 10,
    VEA: 30,
    VOO: 30,
    VTWO: 30
  }
}
```

**getIRAType(options: IRATypeOptions)**

This method provides maximum contribution amount based on the selected IRA type.

```javascript
const IRAType = 'SEP IRA';

const IRAData = await BuildUpClient.getIRAType(IRAType);
```

Options:

- `IRAType` - selected IRA Type (`string`)

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

Options:

- `riskGrowth` - Risk Question Answer (`number`)
- `riskLevel` - Risk Question Answer (`number`)
- `riskLosses` - Risk Question Answer (`number`)
- `riskVolatility` - Risk Question Answer (`number`)

Method returns an object:
```
{
  riskValue: 3.25
}
```
