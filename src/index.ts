import axios from "axios";
import crypto from "crypto";

export default class PhonepeGateway {
    private isDev: boolean;
    private merchantId: string;
    private saltKey: string;
    private saltIndex: number;



    /**
     * Initializes a new instance of the PhonepeGateway class.
     * @param p - Configuration options for the payment processor.
     * @param p.merchantId - The unique identifier for the merchant.
     * @param p.saltKey - The salt key used for encryption.
     * @param [p.saltIndex=1] - The salt index used for encryption.
     * @param [p.isDev=false] - Indicates if the environment is development (default is false).
     */

    constructor(p: {
        merchantId: string;
        saltKey: string;
        saltIndex?: number;
        isDev?: boolean;
    }) {
        this.merchantId = p.merchantId;
        this.saltKey = p.saltKey;

        this.isDev = p.isDev || false;

        this.saltIndex = p.saltIndex ??1;


    }




    /**
   * Initializes the payment process.
   * @param p - Payment details.
   * @param p.amount - The amount to be paid.
   * @param p.transactionId - The unique identifier for the transaction.
   * @param p.userId - The unique identifier for the user.
   * @param p.redirectUrl - The URL to redirect to after payment.
   * @param [p.callbackUrl] - Optional callback URL for notifications.
   * @returns A promise that resolves when the payment is initialized.
   */
    async initPayment(p: {
        amount: number, transactionId: string, userId: string,
        redirectUrl: string
    callbackUrl?: string
    }) {



        const callback = p.callbackUrl || "";

        const DEV_SALT = "96434309-7796-489d-8924-ab56988a6076";
        const DEV_MERCHANT_ID = "PGTESTPAYUAT86";
        const PROD_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
        const DEV_URL: string =
            "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

        const data: any = {
            merchantId: this.isDev ? DEV_MERCHANT_ID : this.merchantId,
            merchantTransactionId: p.transactionId,
            merchantUserId: p.userId,
            amount: p.amount * 100,
            redirectUrl: p.redirectUrl,
            callbackUrl: callback,
            redirectMode: "REDIRECT",
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };

        const payload = JSON.stringify(data);

        const payloadMain = Buffer.from(payload).toString("base64");
        const keyIndex = this.saltIndex;
        const SALT_KEY: string = this.isDev ? DEV_SALT : this.saltKey;
        const string = payloadMain + "/pg/v1/pay" + SALT_KEY;
        const sha256 = crypto.createHash("sha256").update(string).digest("hex");
        const checksum = sha256 + "###" + keyIndex;

        const headers: any = {
            accept: "application/json",
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
        };

        const options = {
            method: "POST",
            url: this.isDev ? DEV_URL : PROD_URL,
            headers: headers,
            data: {
                request: payloadMain,
            },
        };

        try {
          const resp: any = await axios
            .request(options)
            .then(function (response: any) {
                return response.data;
            })
            .catch(function (error: any) {
            return  {success:false, error:`${error}`}
            });
        return resp;
        } catch (error) {
          return {success:false, error:`${error}`}
        }
    }

      /**
   * Get the payment status by transaction ID.
   * @param trId - The unique identifier for the transaction.
   */
     async  paymentStatus(trId: string) {
        const keyIndex = 1;
        const string = `/pg/v1/status/${this.merchantId}/${trId}${this.saltKey}`;
        const sha256 = crypto.createHash("sha256").update(string).digest("hex");
        const checksum = sha256 + "###" + keyIndex;
       
        const url: string = `https://api.phonepe.com/apis/hermes/pg/v1/status/${this.merchantId}/${trId}`;
      
        const headers: any = {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": this.merchantId,
        };
      
        const options = {
          method: "GET",
          url: url,
          headers: headers,
        };
        try {
          const resp: any = await axios
          .request(options)
          .then(function (response: any) {
            return response.data;
          })
          .catch(function (error: any) {
            const data: any = error?.response?.data;
            return data;
          });
        return resp;
          
        } catch (error) {
          return {success:false, error:`${error}`}
        }
      }

      public getChecksum(trId:string){
       try {
        const keyIndex = 1;
        const string = `/pg/v1/status/${this.merchantId}/${trId}${this.saltKey}`;
        const sha256 = crypto.createHash("sha256").update(string).digest("hex");
        const checksum = sha256 + "###" + keyIndex;
        return checksum;
       } catch (error) {
        console.error(error);
        return "";
       }
      }
}



