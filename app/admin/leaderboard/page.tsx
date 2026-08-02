"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


type Leader = {
  username: string;
  completed: number;
  rewards: number;
  correct: number;
  attempts: number;
};


export default function LeaderboardPage(){

  const [leaders,setLeaders] =
    useState<Leader[]>([]);


  const [search,setSearch] =
    useState("");


  const [sort,setSort] =
    useState("rewards");


  const [loading,setLoading] =
    useState(true);



  useEffect(()=>{

    loadLeaderboard();

  },[]);



  async function loadLeaderboard(){


    const {data,error} =
      await supabase
        .from("task_answers")
        .select(
          "username,correct,reward_paid"
        );


    if(error){

      alert(error.message);
      setLoading(false);
      return;

    }



    if(data){


      const users:any = {};



      data.forEach((item)=>{


        if(!users[item.username]){


          users[item.username] = {

            username:item.username,

            completed:0,

            rewards:0,

            correct:0,

            attempts:0

          };


        }



        users[item.username].completed += 1;


        users[item.username].attempts += 1;



        users[item.username].rewards +=
          Number(
            item.reward_paid || 0
          );



        if(item.correct){

          users[item.username].correct += 1;

        }


      });



      const ranking =
        Object.values(users)
        .sort(
          (a:any,b:any)=>
          b.rewards-a.rewards
        );


      setLeaders(
        ranking as Leader[]
      );


    }


    setLoading(false);

  }



  const filteredLeaders =
    leaders
    .filter((user)=>

      user.username
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )

    )
    .sort((a,b)=>{


      if(sort==="tasks"){

        return b.completed -
        a.completed;

      }


      return b.rewards -
      a.rewards;


    });if(loading){

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
        Loading Leaderboard...
      </main>

    );

  }



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


      <h1
        style={{
          fontSize:"36px"
        }}
      >
        🏆 Top Users Leaderboard
      </h1>


      <p
        style={{
          color:"#cbd5e1"
        }}
      >
        Track your best performing users.
      </p>



      <input

        placeholder="🔍 Search username..."

        value={search}

        onChange={(e)=>
          setSearch(e.target.value)
        }

        style={{
          width:"100%",
          padding:"14px",
          borderRadius:"12px",
          border:"none",
          marginTop:"25px",
          marginBottom:"15px"
        }}

      />



      <select

        value={sort}

        onChange={(e)=>
          setSort(e.target.value)
        }

        style={{
          width:"100%",
          padding:"14px",
          borderRadius:"12px",
          marginBottom:"30px"
        }}

      >

        <option value="rewards">
          💰 Highest Rewards
        </option>


        <option value="tasks">
          ✅ Most Tasks
        </option>


      </select>



      <div
        style={{
          display:"grid",
          gap:"20px"
        }}
      >


      {
        filteredLeaders.map(
          (user,index)=>(


          <div

            key={user.username}

            style={{
              background:"#0f172a",
              padding:"25px",
              borderRadius:"20px",
              border:
              "1px solid #334155",
              display:"flex",
              justifyContent:
              "space-between",
              alignItems:"center"
            }}

          >


            <div>

              <h2>

                {
                  index===0
                  ? "🥇"
                  : index===1
                  ? "🥈"
                  : index===2
                  ? "🥉"
                  : "🏅"
                }

                {" "}

                {user.username}

              </h2>


              <p>
                ✅ Tasks:
                {" "}
                {user.completed}
              </p>


              <p>
                🎯 Accuracy:
                {" "}
                {
                  Math.round(
                    (
                      user.correct /
                      user.attempts
                    ) * 100
                  ) || 0
                }%
              </p>


            </div>



            <h2
              style={{
                color:"#22c55e"
              }}
            >
              KES {user.rewards}
            </h2>



          </div>


        ))
      }


      </div>


    </main>

  );

}