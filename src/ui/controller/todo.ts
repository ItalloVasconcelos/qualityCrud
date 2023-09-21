import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

type TodoControllerGetParams = {
    page: number;
};
async function get(params: TodoControllerGetParams) {
    return todoRepository.get({
        page: params.page,
        limit: 1,
    });
}

function filterTodosByContent<Todo>(
    search: string,
    todos: Array<Todo & { content: string }>
): Todo[] {
    const homeTodos = todos.filter((todos) => {
        const searchNormalized = search.toLocaleLowerCase();
        const contentNormalized = todos.content.toLowerCase();
        return contentNormalized.includes(searchNormalized);
    });
    return homeTodos;
}

type TodoControllerCreateParams = {
    content?: string;
    onError: () => void;
    onSucess: (todo: Todo) => void;
};

function create({ content, onError, onSucess }: TodoControllerCreateParams) {
    const parsedParams = schema.string().safeParse(content);
    if (!parsedParams.success) {
        onError();
        return;
    }
    todoRepository
        .createByContent(parsedParams.data)
        .then((newTodo) => {
            onSucess(newTodo);
        })
        .catch(() => {
            onError();
        });
}

export const todoController = {
    get,
    filterTodosByContent,
    create,
};
