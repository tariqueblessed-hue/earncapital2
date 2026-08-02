"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Task = {
  id: number;
  title: string;
  description: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  reward: number;
  active: boolean;
};

export default function AdminTasksPage() {

  const [tasks, setTasks] = useState<Task[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");

  const [correctAnswer, setCorrectAnswer] =
    useState("A");

  const [reward, setReward] =
    useState(50);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {
    loadTasks();
  }, []);


  async function loadTasks(){

    const { data, error } =
      await supabase
        .from("tasks")
        .select("*")
        .order("id", {
          ascending:false
        });


    if(!error && data){

      setTasks(data as Task[]);

    }


    setLoading(false);

  }



  async function createTask(){

    if(
      !title ||
      !description ||
      !optionA ||
      !optionB ||
      !optionC ||
      !optionD
    ){

      alert("Fill all fields");
      return;

    }


    const {error} =
      await supabase
        .from("tasks")
        .insert({

          title,
          description,

          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,

          correct_answer:
            correctAnswer,

          reward,

          active:true

        });


    if(error){

      alert(error.message);
      return;

    }


    alert("✅ Task created");


    setTitle("");
    setDescription("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");

    setReward(50);


    loadTasks();

  }async function toggleTaskStatus(task: Task){

    const { error } =
      await supabase
        .from("tasks")
        .update({
          active: !task.active,
        })
        .eq("id", task.id);


    if(error){

      alert(error.message);
      return;

    }


    loadTasks();

  }



  async function deleteTask(id:number){

    const confirmDelete =
      confirm(
        "Are you sure you want to delete this task?"
      );


    if(!confirmDelete) return;


    const {error} =
      await supabase
        .from("tasks")
        .delete()
        .eq("id",id);


    if(error){

      alert(error.message);
      return;

    }


    loadTasks();

  }



  async function updateTask(){

    if(!editingTask) return;


    const {error} =
      await supabase
        .from("tasks")
        .update({

          title:
            editingTask.title,

          description:
            editingTask.description,

          option_a:
            editingTask.option_a,

          option_b:
            editingTask.option_b,

          option_c:
            editingTask.option_c,

          option_d:
            editingTask.option_d,

          correct_answer:
            editingTask.correct_answer,

          reward:
            editingTask.reward,

        })
        .eq(
          "id",
          editingTask.id
        );


    if(error){

      alert(error.message);
      return;

    }


    alert("✏️ Task updated");


    setEditingTask(null);


    loadTasks();

  }



  if(loading){

    return (

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

        Loading Tasks...

      </main>

    );

  }



  return (

    <main

      style={{
        minHeight:"100vh",
        background:
        "linear-gradient(135deg,#020617,#1e1b4b)",
        color:"white",
        padding:"30px",
        fontFamily:"Arial"
      }}

    >


      <h1>
        👑 Premium Admin Task Manager
      </h1>


      <div

        style={{
          background:"#0f172a",
          padding:"25px",
          borderRadius:"18px",
          marginTop:"25px"
        }}

      >

        <input
          style={input}
          placeholder="Task Title"
          value={title}
          onChange={(e)=>
            setTitle(e.target.value)
          }
        />


        <textarea
          style={{
            ...input,
            height:"100px"
          }}
          placeholder="Question"
          value={description}
          onChange={(e)=>
            setDescription(e.target.value)
          }
        />


        <input
          style={input}
          placeholder="Option A"
          value={optionA}
          onChange={(e)=>
            setOptionA(e.target.value)
          }
        />


        <input
          style={input}
          placeholder="Option B"
          value={optionB}
          onChange={(e)=>
            setOptionB(e.target.value)
          }
        />


        <input
          style={input}
          placeholder="Option C"
          value={optionC}
          onChange={(e)=>
            setOptionC(e.target.value)
          }
        />


        <input
          style={input}
          placeholder="Option D"
          value={optionD}
          onChange={(e)=>
            setOptionD(e.target.value)
          }
        /><select
          style={input}
          value={correctAnswer}
          onChange={(e)=>
            setCorrectAnswer(e.target.value)
          }
        >
          <option value="A">
            Correct Answer A
          </option>

          <option value="B">
            Correct Answer B
          </option>

          <option value="C">
            Correct Answer C
          </option>

          <option value="D">
            Correct Answer D
          </option>

        </select>


        <input
          style={input}
          type="number"
          placeholder="Reward"
          value={reward}
          onChange={(e)=>
            setReward(Number(e.target.value))
          }
        />


        <button
          onClick={createTask}
          style={button}
        >
          ➕ Create Task
        </button>


      </div>



      {editingTask && (

        <div
          style={{
            background:"#1e293b",
            padding:"25px",
            borderRadius:"18px",
            marginTop:"25px"
          }}
        >

          <h2>
            ✏️ Edit Task
          </h2>


          <input
            style={input}
            value={editingTask.title}
            onChange={(e)=>
              setEditingTask({
                ...editingTask,
                title:e.target.value
              })
            }
          />


          <textarea
            style={{
              ...input,
              height:"100px"
            }}
            value={editingTask.description}
            onChange={(e)=>
              setEditingTask({
                ...editingTask,
                description:e.target.value
              })
            }
          />


          <input
            style={input}
            value={editingTask.option_a}
            onChange={(e)=>
              setEditingTask({
                ...editingTask,
                option_a:e.target.value
              })
            }
          />


          <input
            style={input}
            value={editingTask.option_b}
            onChange={(e)=>
              setEditingTask({
                ...editingTask,
                option_b:e.target.value
              })
            }
          />


          <input
            style={input}
            value={editingTask.option_c}
            onChange={(e)=>
              setEditingTask({
                ...editingTask,
                option_c:e.target.value
              })
            }
          />


          <input
            style={input}
            value={editingTask.option_d}
            onChange={(e)=>
              setEditingTask({
                ...editingTask,
                option_d:e.target.value
              })
            }
          />


          <button
            style={button}
            onClick={updateTask}
          >
            💾 Save Changes
          </button>


        </div>

      )}




      <h2 style={{marginTop:"35px"}}>
        📋 Tasks ({tasks.length})
      </h2>



      {tasks.map((task)=>(

        <div

          key={task.id}

          style={{
            background:"#0f172a",
            padding:"20px",
            borderRadius:"18px",
            marginTop:"20px",
            border:"1px solid #334155"
          }}

        >

          <h2>
            {task.title}
          </h2>


          <p>
            {task.description}
          </p>


          <p>
            💰 Reward: KES {task.reward}
          </p>


          <p>
            Status:
            {" "}
            {task.active
            ? "🟢 Active"
            : "🔴 Disabled"}
          </p>



          <button

            style={button}

            onClick={()=>{
              setEditingTask(task)
            }}

          >
            ✏️ Edit Task
          </button>



          <button

            style={{
              ...button,
              background:"#f59e0b",
              marginTop:"10px"
            }}

            onClick={()=>
              toggleTaskStatus(task)
            }

          >

            {task.active
            ? "⏸ Deactivate Task"
            : "✅ Activate Task"}

          </button>



          <button

            style={{
              ...button,
              background:"#dc2626",
              marginTop:"10px"
            }}

            onClick={()=>
              deleteTask(task.id)
            }

          >

            🗑 Delete Task

          </button>


        </div>

      ))}


    </main>

  );

}



const input = {

  width:"100%",
  padding:"14px",
  marginBottom:"15px",
  borderRadius:"10px",
  border:"1px solid #334155",
  background:"#1e293b",
  color:"white"

};


const button = {

  width:"100%",
  padding:"14px",
  border:"none",
  borderRadius:"12px",
  background:
  "linear-gradient(90deg,#2563eb,#7c3aed)",
  color:"white",
  cursor:"pointer",
  fontWeight:"bold",
  fontSize:"16px"

};