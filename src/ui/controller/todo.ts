import { todoRepository } from "@ui/repository/todo";

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

export const todoController = {
    get,
    filterTodosByContent,
};
