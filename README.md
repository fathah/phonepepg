
Easily integrate PhonePe Payment Gateway


<img 
src="https://raw.githubusercontent.com/fathah/phonepepg/main/pepg.svg" height="50" alt="PhonePe PG"/>


### ⚠️ You Need a PhonePe Business account to use this
If you dont have have an account create one by the following link
## [Create PhonePe Business Account](https://business.phonepe.com/register?referral-code=RF2405081130016203949336)


<br/>

# Getting Started
This package package can be used for server-side working with Node.js or Other Server ation supported frameworks like Next.js etc



# Install the Package
```
npm i phonepepg
```

# Usage
Required Parameters:
| param | required |
| ---    | ---   | 
| merchantId | true |
| saltKey | true |
| isDev | false |


### Create an Instance of `PhonepeGateway`
```ts
import PhonepeGateway from 'phonepepg';


const gateway = new PhonepeGateway({
    merchantId: 'MYMERCHANTID',
    saltKey: 'XXXXXXXXXXXXXXXXXXX',
    isDev: true // false for production
  });


```

### Initialize Payment
```ts
const resp = await gateway.initPayment({
    amount:100, 
    transactionId:'TR12345', 
    userId:'userid', 
    redirectUrl:'https://mysite.com/payredirect',
    callbackUrl:'https://mysite.com/callback'
    });
```

### Get Payment Status
```ts
const resp = await gateway.paymentStatus(transactionId);
```

# Contribute
This package is still in development.
[Click to Contribute](https://github.com/fathah/phonepepg)

# License

[MIT License](LICENSE)

Copyright (c) 2024 

[ziqx.cc](https://ziqx.cc)