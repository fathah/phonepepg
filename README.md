
<img 
src="https://raw.githubusercontent.com/fathah/phonepepg/main/pepg.png" height="50" alt="PhonePe PG"/>


# PhonePe Payment Gateway

For server side working with Node.js or Other Server action supported frameworks like Next.js etc



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



```ts
import PhonepeGateway from 'phonepepg';


const gateway = new PhonepeGateway({
    merchantId: 'MYMERCHANTID',
    saltKey: 'XXXXXXXXXXXXXXXXXXX',
    isDev: true // false for production
  });

const resp = await gateway.initPayment({
    amount:100, 
    transactionId:'TR12345', 
    userId:'userid', 
    redirectUrl:'https://mysite.com/payredirect',
    callbackUrl:'https://mysite.com/callback'
    });

```

# Contribute
This package is still in development.
[Click to Contribute](https://github.com/fathah/phonepepg)

# License

[MIT License](LICENSE)

Copyright (c) 2024 

[ziqx.cc](https://ziqx.cc)