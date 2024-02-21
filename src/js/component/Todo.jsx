//main.vs3
import React, { useState } from "react";
import FetchAll from "./FetchAll";

const TodoList = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    const handleAddTodo = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            // Add new todo item to the list
            const newTodo = {
                id: Date.now(),
                label: inputValue.trim(),
                done: false
            };
            setTodos([...todos, newTodo]);

			addTaskToApi();
			console.log("New Todo Added to API: " + newTodo.label);

            setInputValue("");	// Clear input field after adding todo

        }
    };

	const addTaskToApi = () => {
        const updatedTodos = [
            ...todos,
            {
                id: Date.now(), // Assign a unique ID
                label: inputValue.trim(),
                done: false,
            },
        ];

        fetch("https://playground.4geeks.com/apis/fake/todos/user/yjlmotley", {
            method: "PUT",
            body: JSON.stringify(updatedTodos),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((resp) => {
                if (resp.ok) {
                    // If successful, update the todos state
                    setTodos(updatedTodos);
                }
            })
            .catch((error) => console.error("Error adding task to API:", error));
    };

    const handleDeleteTodo = (index) => {
        // Remove todo item from the list locally
        const updatedTodos = todos.filter((todo, i) => index !== i);
        setTodos(updatedTodos);
        // Update the server data by sending a PUT request
        deleteTaskFromApi(updatedTodos);
    };

    const deleteTaskFromApi = (updatedTodos) => {
        fetch("https://playground.4geeks.com/apis/fake/todos/user/yjlmotley", {
            method: "PUT",
            body: JSON.stringify(updatedTodos),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((resp) => {
            if (resp.ok) {
                console.log("Todo deleted successfully from API");
            } else {
                console.error("Failed to delete todo from API");
            }
        })
        .catch((error) => console.error("Error deleting task from API:", error));
    };

    return (
        <div className="container">
            <h1 className="text-center mt-5">todos</h1>
            <div className="card todo-card mx-auto mt-5" style={{ maxWidth: "800px" }}>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <input 
                            type="text"
                            onChange={(e) => setInputValue(e.target.value)} 
                            value={inputValue}
                            onKeyDown={handleAddTodo}
                            placeholder="What needs to be done?"
                        />
                    </li>
                    {todos.length === 0 ? (
                        <li className="list-group-item no-tasks">-- No tasks, add a task --</li>
                    ) : (
                        todos.map((todo, index) => (
                            <li className="list-group-item" key={todo.id}>
                                <div className="list-group-item-todo" id="screen">
                                    {todo.label}
                                </div>
                                <span className="x-container" onClick={() => handleDeleteTodo(index)}>
                                    <i className="fa-solid fa-x"></i>
                                </span>
                            </li>
                        ))
                    )}
                </ul>
                <div className="card-footer text-secondary">
                    {todos.length} {todos.length === 1 ? "item" : "items"} left
                </div>
                <FetchAll todos={todos} setTodos={setTodos} inputValue={inputValue} />
            </div>
        </div>
    );
};

export default TodoList;