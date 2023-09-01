import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";

async function get(req: NextApiRequest, res: NextApiResponse) {
    const query = req.query;
    const page = Number(query.page);
    const limit = Number(query.limit);
    if (query.page && isNaN(page)) {
        res.status(400).json({
            error: {
                message: "`page` must be a number",
            },
        });
        return;
    }
    if (query.limit && isNaN(limit)) {
        res.status(400).json({
            error: {
                message: "`limit` must be a number",
            },
        });
        return;
    }
    const output = todoRepository.get({
        page,
        limit,
    });
    res.status(200).json({
        total: (await output).todos,
        pages: (await output).pages,
        todos: (await output).todos,
    });
}
async function create(req: NextApiRequest, res: NextApiResponse) {
    const body = parse(req.body);

    const createdTodo = await todoRepository.createByContent(req.body.conten);

    res.status(201).json({
        todo: createdTodo,
    });
}
export const todoController = {
    get,
    create,
};
