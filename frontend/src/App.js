import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; 

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const res = await axios.get("http://localhost:8080/show");
      setTodos(res.data);
    } catch (error) {
      console.error("データの取得に失敗しました", error);
    }
  }

  function handleChange(e) {
    setTodo(e.target.value);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!todo.trim()) return;
    try {
      const res = await axios.post("http://localhost:8080/todos", {
        todo,
        isChecked: false,
        priority,
      });
      console.log("登録成功:", res.data);
      setTodo("");
      fetchTodos();
    } catch (error) {
      console.error("登録失敗:", error);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/delete/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("削除失敗:", error);
    }
  };

  const toggleHandler = async (item) => {
    try {
      await axios.put(`http://localhost:8080/update/${item.id}`, {
        is_checked: !item.is_checked,
      });
      fetchTodos();
    } catch (error) {
      console.error("更新失敗:", error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Todoアプリ</h1>

      {/* 新規Todo追加フォーム */}
      <form onSubmit={submitHandler} className="todo-form">
        <input
          type="text"
          placeholder="やることを入力..."
          value={todo}
          onChange={handleChange}
          className="todo-input"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
        >
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>

        <button type="submit" className="add-btn">
          追加
        </button>
      </form>

      {/* 未完了のタスク一覧 */}
      <div className="todo-section">
        <h2>未完了のタスク</h2>
        <ul>
          {todos.filter((item) => !item.is_checked).length === 0 ? (
            <p>未完了のタスクはありません。</p>
          ) : (
            todos
              .filter((item) => !item.is_checked)
              .map((item) => (
                <li key={item.id} className={`todo-item ${item.priority}`}>
                  <div className="todo-left">
                    <input
                      type="checkbox"
                      checked={item.is_checked}
                      onChange={() => toggleHandler(item)}
                    />
                    <span>{item.todo}</span>
                  </div>
                  <div className="todo-right">
                    <span className={`priority-tag ${item.priority}`}>
                      {item.priority}
                    </span>
                    <button
                      className="delete-btn"
                      onClick={() => deleteHandler(item.id)}
                    >
                      削除
                    </button>
                  </div>
                </li>
              ))
          )}
        </ul>
      </div>

      {/* 完了済みのタスク一覧 */}
      <div className="todo-section completed">
        <h2>完了したタスク</h2>
        <ul>
          {todos.filter((item) => item.is_checked).length === 0 ? (
            <p>完了したタスクはありません。</p>
          ) : (
            todos
              .filter((item) => item.is_checked)
              .map((item) => (
                <li key={item.id} className="todo-item done">
                  <div className="todo-left">
                    <input
                      type="checkbox"
                      checked={item.is_checked}
                      onChange={() => toggleHandler(item)}
                    />
                    <span>{item.todo}</span>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => deleteHandler(item.id)}
                  >
                    削除
                  </button>
                </li>
              ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
