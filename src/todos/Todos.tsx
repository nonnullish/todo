import { useEffect, useState } from "react";
import dayjs from "dayjs";

import "./index.css";
import { demo } from "../demo";

interface ITodo {
  id: EpochTimeStamp;
  task: string;
}

const Todo = (props: { todo: ITodo; handleSave: (todo: ITodo) => void; handleDone: (todo: ITodo) => void }) => {
  return (
    <div className="block">
      <input className="checkbox" type="checkbox" onChange={() => props.handleDone(props.todo)} />
      <input
        className="label"
        type="text"
        defaultValue={props.todo.task}
        onChange={({ target }: { target: any }) => props.handleSave({ ...props.todo, task: target.value })}
        onBlur={({ target }: { target: any }) => props.handleSave({ ...props.todo, task: target.value })}
      />
    </div>
  );
};

const Todos = () => {
  const [todos, setTodos] = useState<ITodo[]>(
    localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : demo.todos
  );

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <div className="container">
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          handleSave={(todo) =>
            setTodos((previous: ITodo[]) => previous.map((item) => (item.id === todo.id ? todo : item)))
          }
          handleDone={(todo) => setTodos((previous: ITodo[]) => previous.filter((item) => item.id !== todo.id))}
        />
      ))}
      <div
        className="zone"
        onClick={() => setTodos((previous: ITodo[]) => [...previous, { id: dayjs().valueOf(), task: "" }])}
      />
    </div>
  );
};

export default Todos;
