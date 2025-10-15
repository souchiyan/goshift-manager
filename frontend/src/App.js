import { useState } from "react";
import axios from "axios";

function App() {
  const [todo, setTodo] = useState("");

  function handleChange(e) {
    setTodo(e.target.value);
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/todos", { todo });
      console.log("リクエスト成功", res.data);
      setTodo("");
    } catch (error) {
      console.log("リクエスト失敗");
    }
  };
  return (
    <div>
      <div>
        <ul>
          {/* {todo.map((item) => {
            <li>{item}</li>
          })}
           */}
        </ul>
      </div>
      <div>
        <h1>ここはTodoアプリの中身です</h1>
        <form onSubmit={submitHandler}>
          <label name="todo">やること：</label>
          <input
            type="text"
            placeholder="例：勉強する"
            id="todo"
            value={todo}
            onChange={handleChange}
          />
          <button type="submit" >送信する</button>
        </form>
      </div>
    </div>
  );
}

export default App;
