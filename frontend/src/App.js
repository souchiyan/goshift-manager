import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  // 初回レンダー時に全Todoを取得
  useEffect(() => {
    fetchTodos();
  }, []);

  // Todo一覧を取得
  async function fetchTodos() {
    try {
      const res = await axios.get("http://localhost:8080/show");
      setTodos(res.data);
    } catch (error) {
      console.error("データの取得に失敗しました", error);
    }
  }

  // 入力欄の変更を監視
  function handleChange(e) {
    setTodo(e.target.value);
  }

  // 新規Todoを登録
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!todo.trim()) return; // 空文字防止
    try {
      const res = await axios.post("http://localhost:8080/todos", {
        todo,
        isChecked: false,
      });
      console.log("登録成功:", res.data);
      setTodo("");
      fetchTodos();
    } catch (error) {
      console.error("登録失敗:", error);
    }
  };

  // Todo削除
  const deleteHandler = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/delete/${id}`);
      console.log("削除成功");
      fetchTodos();
    } catch (error) {
      console.error("削除失敗:", error);
    }
  };

  // 完了状態の切り替え（チェックボックス）
  const toggleHandler = async (item) => {
    try {
      const res = await axios.put(`http://localhost:8080/update/${item.id}`, {
        is_checked: !item.is_checked, // 状態を反転させる
      });
      console.log("完了状態更新:", res.data);
      fetchTodos(); // 最新データ取得
    } catch (error) {
      console.error("更新失敗:", error);
    }
  };

  return (
    <div style={{ width: "600px", margin: "40px auto", textAlign: "center" }}>
      <h1>Todoアプリ</h1>

      {/* 新規Todo追加フォーム */}
      <form onSubmit={submitHandler} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="やることを入力"
          value={todo}
          onChange={handleChange}
          style={{ padding: "8px", width: "70%" }}
        />
        <button
          type="submit"
          style={{ padding: "8px 16px", marginLeft: "8px" }}
        >
          追加
        </button>
      </form>

      {/* 未完了のタスク一覧 */}
      <div style={{ marginBottom: "30px" }}>
        <h2>未完了のタスク</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.filter((item) => !item.is_checked).length === 0 ? (
            <p>未完了のタスクはありません。</p>
          ) : (
            todos
              .filter((item) => !item.is_checked)
              .map((item) => (
                <li
                  key={item.id}
                  style={{
                    margin: "10px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={item.is_checked}
                      onChange={() => toggleHandler(item)}
                      style={{ marginRight: "8px" }}
                    />
                    {item.todo}
                  </div>
                  <button onClick={() => deleteHandler(item.id)}>削除</button>
                </li>
              ))
          )}
        </ul>
      </div>

      {/* 完了済みのタスク一覧 */}
      <div>
        <h2>完了したタスク</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.filter((item) => item.is_checked).length === 0 ? (
            <p>完了したタスクはありません。</p>
          ) : (
            todos
              .filter((item) => item.is_checked)
              .map((item) => (
                <li
                  key={item.id}
                  style={{
                    margin: "10px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "gray",
                    textDecoration: "line-through",
                  }}
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={item.is_checked}
                      onChange={() => toggleHandler(item)}
                      style={{ marginRight: "8px" }}
                    />
                    {item.todo}
                  </div>
                  <button onClick={() => deleteHandler(item.id)}>削除</button>
                </li>
              ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
