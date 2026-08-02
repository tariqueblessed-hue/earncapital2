"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function AnalyticsPage() {


  const [totalTasks,setTotalTasks] =
    useState(0);

  const [totalAttempts,setTotalAttempts] =
    useState(0);

  const [correctAnswers,setCorrectAnswers] =
    useState(0);

  const [wrongAnswers,setWrongAnswers] =
    useState(0);

  const [totalRewards,setTotalRewards] =
    useState(0);

  const [successRate,setSuccessRate] =
    useState(0);


  const [loading,setLoading] =
    useState(true);



  useEffect(()=>{

    loadAnalytics();

  },[]);



  async function loadAnalytics(){


    const {data:tasks} =
      await supabase
        .from("tasks")
        .select("id");



    if(tasks){

      setTotalTasks(
        tasks.length
      );

    }




    const {data:answers} =
      await supabase
        .from("task_answers")
        .select(
          "correct,reward_paid"
        );



    if(answers){


      const correct =
        answers.filter(
          (item)=>
            item.correct === true
        ).length;



      const wrong =
        answers.filter(
          (item)=>
            item.correct === false
        ).length;



      const rewards =
        answers.reduce(
          (sum,item)=>
            sum +
            Number(
              item.reward_paid || 0
            ),
          0
        );



      setTotalAttempts(
        answers.length
      );


      setCorrectAnswers(
        correct
      );


      setWrongAnswers(
        wrong
      );


      setTotalRewards(
        rewards
      );



      if(answers.length > 0){

        setSuccessRate(
          Math.round(
            (correct /
            answers.length) *
            100
          )
        );

      }

    }


    setLoading(false);

  }



  if(loading){

    return(

      <main

        style={{
          minHeight:"100vh",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          background:"#020617",
          color:"white",
          fontSize:"25px"
        }}

      >

        Loading Analytics...

      </main>

    );

  }return (

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


      <h1

        style={{
          fontSize:"36px",
          fontWeight:"bold"
        }}

      >

        📊 Admin Analytics Dashboard

      </h1>


      <p

        style={{
          color:"#cbd5e1"
        }}

      >

        Monitor EarnCapital performance.

      </p>



      <div

        style={{
          display:"grid",
          gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
          gap:"20px",
          marginTop:"35px"
        }}

      >


        <Card

          title="Total Tasks"
          value={totalTasks}
          icon="📝"
          color="#38bdf8"

        />



        <Card

          title="Task Attempts"
          value={totalAttempts}
          icon="👥"
          color="#a855f7"

        />



        <Card

          title="Correct Answers"
          value={correctAnswers}
          icon="✅"
          color="#22c55e"

        />



        <Card

          title="Wrong Answers"
          value={wrongAnswers}
          icon="❌"
          color="#ef4444"

        />



        <Card

          title="Rewards Paid"
          value={`KES ${totalRewards}`}
          icon="💰"
          color="#facc15"

        />



        <Card

          title="Success Rate"
          value={`${successRate}%`}
          icon="🏆"
          color="#fb923c"

        />


      </div>



    </main>

  );

}




function Card({

  title,
  value,
  icon,
  color

}:{

  title:string;
  value:any;
  icon:string;
  color:string;

}){


  return (

    <div

      style={{

        background:"#0f172a",

        padding:"25px",

        borderRadius:"20px",

        border:
        "1px solid #334155",

        boxShadow:
        "0 10px 30px rgba(0,0,0,0.3)"

      }}

    >


      <h2>

        {icon} {title}

      </h2>



      <h1

        style={{

          color,

          fontSize:"38px",

          marginTop:"15px"

        }}

      >

        {value}

      </h1>


    </div>

  );

}