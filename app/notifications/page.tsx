"use client";

import { useEffect, useState } from "react";

export default function NotificationsPage() {

  const [user, setUser] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);


  useEffect(() => {

    const currentUser =
      localStorage.getItem("currentUser") || "";


    if (!currentUser) {
      window.location.href="/login";
      return;
    }


    setUser(currentUser);



    const savedNotifications =
      JSON.parse(
        localStorage.getItem(
          `notifications_${currentUser}`
        ) || "[]"
      );


    setNotifications(savedNotifications);


  },[]);





  return (

    <main
      style={{
        minHeight:"100vh",
        background:
        "linear-gradient(135deg,#020617,#1e1b4b,#312e81)",
        color:"white",
        padding:"25px",
        fontFamily:"Arial"
      }}
    >


      <h1>
        🔔 Notifications
      </h1>


      <p style={{color:"#cbd5e1"}}>
        Stay updated with your EarnCapital activities.
      </p>





      {
        notifications.length === 0 ?

        (

          <div
            style={{
              marginTop:"30px",
              background:"#1e293b",
              padding:"25px",
              borderRadius:"15px",
              textAlign:"center"
            }}
          >

            <h2>
              📭 No Notifications
            </h2>

            <p>
              Your updates will appear here.
            </p>

          </div>

        )


        :


        notifications.map(
          (note,index)=>(

            <div
              key={index}
              style={{
                marginTop:"20px",
                background:
                "linear-gradient(135deg,#2563eb,#7c3aed)",
                padding:"20px",
                borderRadius:"15px",
                boxShadow:
                "0 10px 25px rgba(0,0,0,0.3)"
              }}
            >

              <h3>
                {note.title}
              </h3>


              <p>
                {note.message}
              </p>


              <small>
                📅 {note.date}
              </small>


            </div>

          )

        )

      }






      <button
        onClick={()=>
          window.location.href="/dashboard"
        }
        style={{
          marginTop:"30px",
          padding:"14px 25px",
          border:"none",
          borderRadius:"12px",
          background:"#334155",
          color:"white",
          cursor:"pointer"
        }}
      >

        ← Back Dashboard

      </button>


    </main>

  );

}