import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log(
      "M-PESA CALLBACK:",
      JSON.stringify(body, null, 2)
    );

    const stkCallback = body?.Body?.stkCallback;

    if (!stkCallback) {
      return NextResponse.json({
        ResultCode: 1,
        ResultDesc: "Invalid callback",
      });
    }


    // Payment successful
    if (stkCallback.ResultCode === 0) {

      const items =
        stkCallback.CallbackMetadata?.Item || [];


      let receipt = "";
      let phone = "";
      let amount = 0;


      items.forEach((item: any) => {

        if (item.Name === "MpesaReceiptNumber") {
          receipt = item.Value;
        }

        if (item.Name === "PhoneNumber") {
          phone = String(item.Value);
        }

        if (item.Name === "Amount") {
          amount = Number(item.Value);
        }

      });


      console.log({
        receipt,
        phone,
        amount,
      });



      // Activate user
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("phone", phone)
        .single();



      if (error || !user) {

        console.log(
          "User not found",
          error
        );

      } else {


        await supabase
          .from("users")
          .update({

            fee_paid: true,

            is_activated: true,

            balance:
              Number(user.balance || 0)

          })
          .eq("phone", phone);



        console.log(
          "ACCOUNT ACTIVATED SUCCESSFULLY"
        );

      }


    }



    return NextResponse.json({

      ResultCode: 0,

      ResultDesc:
        "Callback received"

    });



  } catch(error:any) {


    console.error(
      "Callback error:",
      error
    );


    return NextResponse.json({

      ResultCode: 1,

      ResultDesc:
        "Callback failed"

    },
    {
      status:500
    });

  }
}