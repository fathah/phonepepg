import axios from "axios";
import crypto from "crypto";

export class PhonepeGateway {
    private isDev: boolean;
    private merchatId: string;
    private saltKey: string;



    /**
     * Initializes a new instance of the PhonepeGateway class.
     * @param p - Configuration options for the payment processor.
     * @param p.merchantId - The unique identifier for the merchant.
     * @param p.saltKey - The salt key used for encryption.
     * @param [p.isDev=false] - Indicates if the environment is development (default is false).
     */

    constructor(p: {
        merchantId: string;
        saltKey: string;

        isDev?: boolean;
    }) {
        this.merchatId = p.merchantId;
        this.saltKey = p.saltKey;

        this.isDev = p.isDev || false;


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
            merchantId: this.isDev ? DEV_MERCHANT_ID : this.merchatId,
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
        const keyIndex = 1;
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
        const resp: any = await axios
            .request(options)
            .then(function (response: any) {
                return response.data;
            })
            .catch(function (error: any) {
                console.error(error);
                return null;
            });
        return resp;
    }
}