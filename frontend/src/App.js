import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  function handleChange(e) {
    setTodo(e.target.value);
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/todos", { todo });
      fetchTodos();
      console.log("リクエスト成功", res.data);
      setTodo("");
    } catch (error) {
      console.log("リクエスト失敗");
    }
  };
  async function fetchTodos() {
    const res = await axios.get("http://localhost:8080/show");
    setTodos(res.data);
  }
  
  return (
    <div>
      <h1>ここはTodoアプリの中身です</h1>
      <ul>
        {todos.map((item) => (
          <li key={item.id}>{item.todo}</li>
        ))}
      </ul>

      <form onSubmit={submitHandler}>
        <label htmlFor="todo">やること：</label>
        <input
          type="text"
          placeholder="例：勉強する"
          id="todo"
          value={todo}
          onChange={handleChange}
        />
        <button type="submit">送信する</button>
      </form>
    </div>
  );
}
export default App;
