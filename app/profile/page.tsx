"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function ProfilePage(){


  const [username,setUsername] =
    useState("");

  const [completed,setCompleted] =
    useState(0);

  const [rewards,setRewards] =
    useState(0);

  const [accuracy,setAccuracy] =
    useState(0);

  const [xp,setXp] =
    useState(0);

  const [level,setLevel] =
    useState(1);


  const [loading,setLoading] =
    useState(true);



  useEffect(()=>{

    loadProfile();

  },[]);



  async function loadProfile(){


    const user =
      localStorage.getItem(
        "currentUser"
      );


    if(!user){

      window.location.href =
        "/login";

      return;

    }


    setUsername(user);



    const {data,error} =
      await supabase
        .from("task_answers")
        .select(
          "correct,reward_paid"
        )
        .eq(
          "username",
          user
        );



    if(error){

      alert(error.message);
      return;

    }



    if(data){


      const total =
        data.length;


      const correct =
        data.filter(
          (item)=>
          item.correct === true
        ).length;



      const money =
        data.reduce(
          (sum,item)=>
          sum +
          Number(
            item.reward_paid || 0
          ),
          0
        );



      const userXP =
        total * 10;



      setCompleted(
        total
      );


      setRewards(
        money
      );


      setXp(
        userXP
      );


      setLevel(
        Math.floor(
          userXP / 100
        ) + 1
      );



      if(total > 0){

        setAccuracy(
          Math.round(
            (correct / total)
            * 100
          )
        );

      }

    }


    setLoading(false);

  }if(loading){

    return(

      <main
        style={{
          minHeight:"100vh",
          background:"#020617",
          color:"white",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          fontSize:"25px"
        }}
      >

        Loading Profile...

      </main>

    );

  }



  const rank =
    level >= 20
    ? "💎 Diamond"
    : level >= 10
    ? "🥇 Gold"
    : level >= 5
    ? "🥈 Silver"
    : "🥉 Bronze";



  const nextLevelXP =
    level * 100;



  const progress =
    Math.min(
      (xp / nextLevelXP) * 100,
      100
    );



  return(

    <main

      style={{
        minHeight:"100vh",
        background:
        "linear-gradient(135deg,#020617,#1e1b4b,#312e81)",
        color:"white",
        padding:"30px",
        fontFamily:"Arial"
      }}

    >


      <h1>
        👤 My Profile
      </h1>



      <div

        style={{
          background:"#0f172a",
          padding:"30px",
          borderRadius:"25px",
          marginTop:"30px",
          border:
          "1px solid #334155"
        }}

      >


        <h2>
          👋 {username}
        </h2>


        <h2>
          {rank}
        </h2>



        <h3>
          ⭐ Level {level}
        </h3>



        <p>
          XP:
          {" "}
          {xp}
          /
          {nextLevelXP}
        </p>



        <div

          style={{
            width:"100%",
            height:"18px",
            background:"#334155",
            borderRadius:"20px"
          }}

        >

          <div

            style={{
              width:`${progress}%`,
              height:"100%",
              background:
              "linear-gradient(90deg,#22c55e,#3b82f6)",
              borderRadius:"20px"
            }}

          />

        </div>



      </div>



      <div

        style={{
          display:"grid",
          gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
          gap:"20px",
          marginTop:"30px"
        }}

      >


        <StatCard

          title="Tasks Completed"
          value={completed}
          icon="✅"

        />


        <StatCard

          title="Total Earned"
          value={`KES ${rewards}`}
          icon="💰"

        />


        <StatCard

          title="Accuracy"
          value={`${accuracy}%`}
          icon="🎯"

        />


      </div><button

        onClick={()=>
          window.location.href =
          "/dashboard"
        }

        style={{
          marginTop:"30px",
          width:"100%",
          padding:"14px",
          border:"none",
          borderRadius:"12px",
          background:"#334155",
          color:"white",
          cursor:"pointer",
          fontSize:"16px",
          fontWeight:"bold"
        }}

      >

        ← Back Dashboard

      </button>


    </main>

  );

}



function StatCard({

  title,
  value,
  icon

}:{

  title:string;
  value:any;
  icon:string;

}){


  return (

    <div

      style={{
        background:"#0f172a",
        padding:"25px",
        borderRadius:"20px",
        border:
        "1px solid #334155",
        textAlign:"center"
      }}

    >

      <h2>
        {icon}
      </h2>


      <h3>
        {title}
      </h3>


      <h1
        style={{
          color:"#38bdf8"
        }}
      >
        {value}
      </h1>


    </div>

  );

}