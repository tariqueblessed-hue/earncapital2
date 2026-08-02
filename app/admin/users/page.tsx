"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {
    const savedUsers = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const userData = savedUsers.map((user: any) => {
      const balance =
        Number(
          localStorage.getItem(
            `balance_${user.username}`
          )
        ) || 0;

      const referrals =
        Number(
          localStorage.getItem(
            `referrals_${user.username}`
          )
        ) || 0;

      return {
        ...user,
        balance,
        referrals,
      };
    });

    setUsers(userData);
  }


  function updateBalance(
    username: string,
    amount: number
  ) {

    const current =
      Number(
        localStorage.getItem(
          `balance_${username}`
        )
      ) || 0;


    const newBalance =
      Math.max(current + amount, 0);


    localStorage.setItem(
      `balance_${username}`,
      String(newBalance)
    );


    loadUsers();

    alert(
      `${username} balance updated`
    );
  }



  return (
    <main
      style={{
        minHeight:"100vh",
        padding:"30px",
        background:"#f1f5f9",
        fontFamily:"Arial"
      }}
    >

      <h1>
        👥 Users Management
      </h1>


      {
        users.length === 0 ? (

          <p>
            No registered users found.
          </p>

        ) : (

          users.map((user,index)=>(

            <div
              key={index}
              style={{
                background:"white",
                marginTop:"20px",
                padding:"20px",
                borderRadius:"15px",
                boxShadow:
                "0 5px 15px rgba(0,0,0,.1)"
              }}
            >

              <h2>
                👤 {user.username}
              </h2>


              <p>
                💰 Balance:
                <strong>
                  {" "}KES {user.balance}
                </strong>
              </p>


              <p>
                👥 Referrals:
                {" "}{user.referrals}
              </p>


              <div
                style={{
                  display:"flex",
                  gap:"10px",
                  marginTop:"15px"
                }}
              >

                <button
                  onClick={() =>
                    updateBalance(
                      user.username,
                      100
                    )
                  }
                  style={buttonGreen}
                >
                  ➕ Add 100
                </button>


                <button
                  onClick={() =>
                    updateBalance(
                      user.username,
                      -100
                    )
                  }
                  style={buttonRed}
                >
                  ➖ Remove 100
                </button>


              </div>


            </div>

          ))

        )
      }


    </main>
  );
}



const buttonGreen = {
  padding:"12px 18px",
  border:"none",
  borderRadius:"10px",
  background:"#22c55e",
  color:"white",
  cursor:"pointer",
};


const buttonRed = {
  padding:"12px 18px",
  border:"none",
  borderRadius:"10px",
  background:"#ef4444",
  color:"white",
  cursor:"pointer",
};