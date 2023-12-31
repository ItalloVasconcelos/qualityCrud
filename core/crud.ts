import fs from "fs";
import { v4 as uuid } from "uuid";
// const fs = require('fs') CommonJS - Padrão node

type UUID = string;

type TODO = {
    id: UUID;
    date: string;
    content: string;
    done: boolean;
};
const DB_FILE_PATH = "./core/db";

export function create(content: string): TODO {
    const todo: TODO = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false,
    };
    const todos: Array<TODO> = [...read(), todo];

    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify({ todos, dogs: [] }, null, 2)
    );
    return todo;
}

export function read(): Array<TODO> {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(dbString || "{}"); //Transforma  em obj javascript
    if (!db.todos) {
        return [];
    }
    return db.todos;
}

export function update(id: UUID, partialTodo: Partial<TODO>): TODO {
    let updatedTodo;
    const todos = read();
    todos.forEach((currentTODO) => {
        const isToUpdate = currentTODO.id === id;
        if (isToUpdate) {
            updatedTodo = Object.assign(currentTODO, partialTodo);
        }
    });
    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos,
            },
            null,
            2
        )
    );
    if (!updatedTodo) {
        throw new Error("Please, provide another ID!");
    }
    return updatedTodo;
}

export function updateContentById(id: UUID, content: string): TODO {
    return update(id, { content });
}

export function deleteById(id: UUID) {
    const todos = read();
    const todosWithoutOne = todos.filter((todo) => {
        if (id === todo.id) {
            return false;
        }
        return true;
    });
    fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(
            {
                todos: todosWithoutOne,
            },
            null,
            2
        )
    );
}

export function clearDb() {
    fs.writeFileSync(DB_FILE_PATH, "");
}
