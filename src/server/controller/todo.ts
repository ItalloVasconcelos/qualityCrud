import { read } from "@db-crud-todo";
import { NextApiRequest, NextApiResponse } from "next";

function get(req: NextApiRequest, res: NextApiResponse) {
    const allTodos = read();
    res.status(200).json({
        todos: allTodos,
    });
}
export const todoController = {
    get,
};
