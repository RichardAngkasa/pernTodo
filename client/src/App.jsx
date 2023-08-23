import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState();
  const [todoText, setTodoText] = useState({ todo: "", edit: "" });
  const [open, setOpen] = useState({ open: false, id: 0 });

  //isi todo
  const postTodo = async (todo) => {
    try {
      await fetch("http://localhost:5001/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: todo,
        }),
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  //update to do
  const updateTodo = async (e) => {
    console.log(e);
    try {
      await fetch(`http://localhost:5001/todos/${open.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: e,
        }),
      });
      window.location = "/";
    } catch (error) {
      console.error(error.message);
    }
  };

  //ambil todo
  const getTodos = async () => {
    try {
      const response = await fetch("http://localhost:5001/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.message(error.message);
    }
  };

  //hapus todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:5001/todos/${id}`, { method: "DELETE" });
      setTodos(todos.filter((todo) => todo.id !== id));
      window.location = "/";
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <>
      <div
        className={`${
          open.open ? "block" : "hidden"
        } h-screen w-full absolute flex justify-center items-center backdrop-blur-sm`}
      >
        <div className="mx-auto h-60">
          <div className="flex mt-4 items-center">
            <button
              className="flex-no-shrink p-2 border-2 rounded text-teal border-teal hover:text-white hover:bg-teal"
              onClick={() => setOpen((prev) => ({ ...prev, open: false }))}
            >
              Back
            </button>
            <form className="flex">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
                placeholder={
                  todos?.filter((unit) => {
                    if (unit.todo_id == open.id) {
                      return unit.description;
                    }
                  })[0]?.description
                }
                value={todoText.edit}
                onChange={(e) =>
                  setTodoText((prev) => ({ ...prev, edit: e.target.value }))
                }
              />
              <button
                className="flex-no-shrink p-2 border-2 rounded text-teal border-teal hover:text-white hover:bg-teal"
                onClick={() => updateTodo(todoText.edit)}
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
        <div className="bg-gray-300 rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
          <div className="mb-4">
            <h1 className="text-grey-darkest">Todo List</h1>
            <form className="flex mt-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
                autoFocus
                placeholder="Add Todo"
                value={todoText.todo}
                onChange={(e) =>
                  setTodoText((prev) => ({ ...prev, todo: e.target.value }))
                }
              />
              <button
                className="flex-no-shrink p-2 border-2 rounded text-teal border-teal hover:text-white hover:bg-black/50"
                onClick={() => postTodo(todoText.todo)}
              >
                Add
              </button>
            </form>
          </div>
          {todos?.map((unit, index) => {
            return (
              <div key={index}>
                <div className="flex mb-4 items-center">
                  <p className="w-full text-grey-darkest">
                    {unit?.description}
                  </p>
                  <button
                    className="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green-500 border-green-500 hover:bg-green-500"
                    onClick={() =>
                      open.open
                        ? setOpen({ open: false, id: unit.todo_id })
                        : setOpen({ open: true, id: unit.todo_id })
                    }
                  >
                    EDIT
                  </button>
                  <button
                    className="flex-no-shrink p-2 ml-2 border-2 rounded text-red-500 border-red hover:text-white hover:bg-red-500"
                    onClick={() => {
                      deleteTodo(unit.todo_id);
                      getTodos();
                    }}
                  >
                    DELETE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
