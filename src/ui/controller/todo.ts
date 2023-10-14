import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

type TodoControllerGetParams = {
    page: number;
};
async function get(params: TodoControllerGetParams) {
    return todoRepository.get({
        page: params.page,
        limit: 5,
    });
}

function filterTodosByContent(search: string, todos: Todo[]) {
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
    onSuccess: (todo: Todo) => void;
};

function create({ content, onError, onSuccess }: TodoControllerCreateParams) {
    const parsedParams = schema.string().min(1).safeParse(content);
    if (!parsedParams.success) {
        onError();
        return;
    }
    todoRepository
        .createByContent(parsedParams.data)
        .then((newTodo) => {
            onSuccess(newTodo);
        })
        .catch(() => {
            if (!content || content.trim() === "") {
                onError();
                return;
            }
            onError();
        });
}

type TodoControllerToggleDoneParams = {
    id: string;
    updateTodoOnScreen: () => void;
    onError: () => void;
};

function toggleDone({
    id,
    updateTodoOnScreen,
}: TodoControllerToggleDoneParams) {
    // updateTodoOnScreen();
    todoRepository.toggleDone(id).then(() => {
        updateTodoOnScreen();
    });
}

async function deleteById(id: string): Promise<void> {
    const todoId = id;
    todoRepository.deleteById(todoId);
}
export const todoController = {
    get,
    filterTodosByContent,
    create,
    toggleDone,
    deleteById,
};
