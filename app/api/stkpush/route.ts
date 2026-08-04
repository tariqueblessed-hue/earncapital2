import { NextResponse } from "next/server";

const consumerKey = process.env.MPESA_CONSUMER_KEY!;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
const shortcode = process.env.MPESA_SHORTCODE!;
const passkey = process.env.MPESA_PASSKEY!;
const callbackUrl = process.env.MPESA_CALLBACK_URL!;


async function getAccessToken() {
  const auth = Buffer.from(
    `${consumerKey}:${consumerSecret}`
  ).toString("base64");


  const response = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );


  const data = await response.json();

  return data.access_token;
}



function getTimestamp() {

  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2,"0");
  const day = String(now.getDate()).padStart(2,"0");
  const hour = String(now.getHours()).padStart(2,"0");
  const minute = String(now.getMinutes()).padStart(2,"0");
  const second = String(now.getSeconds()).padStart(2,"0");


  return `${year}${month}${day}${hour}${minute}${second}`;
}



export async function POST(req: Request) {

  try {

    const { phone, amount } = await req.json();


    if (!phone || !amount) {

      return NextResponse.json(
        {
          success:false,
          message:"Phone and amount required"
        },
        {
          status:400
        }
      );

    }



    const token = await getAccessToken();


    const timestamp = getTimestamp();


    const password = Buffer.from(
      `${shortcode}${passkey}${timestamp}`
    ).toString("base64");



    const formattedPhone = phone.startsWith("254")
      ? phone
      : phone.replace(/^0/, "254");



    const body = {

      BusinessShortCode: shortcode,

      Password: password,

      Timestamp: timestamp,

      TransactionType:
        "CustomerPayBillOnline",

      Amount: Number(amount),

      PartyA: formattedPhone,

      PartyB: shortcode,

      PhoneNumber: formattedPhone,

      CallBackURL: callbackUrl,

      AccountReference:
        "EarnCapital",

      TransactionDesc:
        "Account Activation"

    };



    const response = await fetch(

      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",

      {

        method:"POST",

        headers:{

          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json"

        },

        body:
          JSON.stringify(body)

      }

    );



    const result = await response.json();



    return NextResponse.json(result);



  } catch(error:any){


    console.log(error);


    return NextResponse.json(

      {

        success:false,

        message:"STK Push failed",

        error:error.message

      },

      {

        status:500

      }

    );

  }

}