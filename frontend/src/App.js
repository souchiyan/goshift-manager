import { useState } from "react";

function App() {

  const [todo, setTodo] = useState("")

  function handleChange (e) {
    setTodo(e.target.value)
  }
  function submitHandler() {
    axios({
      method: 'post',
      data:{

      }
    })
  }
  return (
    <div>
      <div>
        <ul>
          
        </ul>
      </div>
      <div>
        <h1>ここはTodoアプリの中身です</h1>
        <form type="sumbit" onSubmit={submitHandler}>
          <label name="todo">やること：</label>
          <input type="text" placeholder="例：勉強する" name="todo" onChange={handleChange}/>
          <button>送信する</button>
        </form>
      </div>
    </div>
  );
}

export default App;
