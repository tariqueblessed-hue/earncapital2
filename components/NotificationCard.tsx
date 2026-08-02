"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}


export default function NotificationCard() {

  const [notifications,setNotifications] =
    useState<Notification[]>([]);


  const [userId,setUserId] =
    useState("");



  useEffect(()=>{

    loadNotifications();

  },[]);



  async function loadNotifications(){

    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();


    if(!user) return;


    setUserId(user.id);



    const {data,error} =
      await supabase
      .from("notifications")
      .select("*")
      .eq(
        "user_id",
        user.id
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      );


    if(error){
      console.log(error.message);
      return;
    }


    setNotifications(data || []);

  }




  async function markRead(id:number){


    await supabase
    .from("notifications")
    .update({
      is_read:true
    })
    .eq(
      "id",
      id
    );


    loadNotifications();

  }




  function getIcon(title:string){

    if(title.includes("Deposit"))
      return "💳";

    if(title.includes("Withdrawal"))
      return "💸";

    if(title.includes("Activated"))
      return "🔐";


    if(title.includes("Reward"))
      return "🎁";


    return "🔔";

  }



  return (

    <div
      style={{
        background:
        "linear-gradient(135deg,#0f172a,#1e293b)",
        borderRadius:"22px",
        padding:"25px",
        color:"white",
        boxShadow:
        "0 15px 35px rgba(0,0,0,.25)",
        marginTop:"25px"
      }}
    >


      <div
        style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center"
        }}
      >

        <h2>
          🔔 Notifications
        </h2>


        <span
          style={{
            background:"#2563eb",
            padding:"6px 12px",
            borderRadius:"20px",
            fontSize:"13px"
          }}
        >
          {notifications.filter(
            n=>!n.is_read
          ).length}
          {" "}
          New
        </span>


      </div>



      {
        notifications.length === 0 ? (

          <p
            style={{
              color:"#94a3b8"
            }}
          >
            No notifications yet.
          </p>

        ) : (


        notifications.map((notification)=>(

          <div
            key={
              notification.id
            }
            style={{
              background:
              notification.is_read
              ?
              "rgba(255,255,255,.05)"
              :
              "rgba(37,99,235,.25)",

              border:
              "1px solid rgba(255,255,255,.1)",

              padding:"18px",

              borderRadius:"16px",

              marginTop:"15px",

              backdropFilter:
              "blur(10px)"
            }}
          >


            <div
              style={{
                display:"flex",
                gap:"15px",
                alignItems:"center"
              }}
            >

              <div
                style={{
                  fontSize:"30px"
                }}
              >
                {
                  getIcon(
                    notification.title
                  )
                }
              </div>


              <div>

                <h3
                  style={{
                    margin:0
                  }}
                >
                  {
                    notification.title
                  }
                </h3>


                <p
                  style={{
                    color:"#cbd5e1"
                  }}
                >
                  {
                    notification.message
                  }
                </p>


                <small
                  style={{
                    color:"#94a3b8"
                  }}
                >
                  {
                    new Date(
                      notification.created_at
                    )
                    .toLocaleString()
                  }
                </small>


              </div>


            </div>



            {
              !notification.is_read && (

                <button
                  onClick={()=>
                    markRead(
                      notification.id
                    )
                  }
                  style={{
                    marginTop:"12px",
                    background:
                    "#2563eb",
                    color:"white",
                    border:"none",
                    padding:"8px 15px",
                    borderRadius:"10px",
                    cursor:"pointer"
                  }}
                >
                  Mark as read
                </button>

              )
            }



          </div>


        ))

        )

      }


    </div>

  );

}