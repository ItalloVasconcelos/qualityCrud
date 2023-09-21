import { z as schema } from "zod";
import { Todo, TodoSchema } from "@ui/schema/todo";
type TodoRepositoryGetParams = {
    page: number;
    limit: number;
};
type TodoRepositoryGetOutput = {
    todos: Todo[];
    totalTodos: number;
    pages: number;
};
function get({
    page,
    limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
    return fetch(`/api/todos?page=${page}&limit=${limit}`).then(
        async (responseServer) => {
            const todosString = await responseServer.text();
            const responseParsed = parseTodosFromServer(
                JSON.parse(todosString)
            );

            return {
                todos: responseParsed.todos,
                total: responseParsed.total,
                pages: responseParsed.pages,
            };
        }
    );
}

export async function createByContent(content: string): Promise<Todo> {
    const response = await fetch("api/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content,
        }),
    });
    if (response.ok) {
        const serverResponse = await response.json();
        const serverResponseSchema = schema.object({
            todo: TodoSchema,
        });
        const serverResponseParsed =
            serverResponseSchema.safeParse(serverResponse);
        if (!serverResponseParsed.success) {
            throw new Error("Failed to create TODO");
        }
        console.log("serverResponse", serverResponseParsed);
        const todo = serverResponseParsed.data.todo;
        return todo;
    }
    throw new Error("Failed to create TODO ");
}
export const todoRepository = {
    get,
    createByContent,
};

// type Todo = {
//     id: string;
//     content: string;
//     date: Date;
//     done: boolean;
// };

function parseTodosFromServer(responseBody: unknown): {
    total: number;
    pages: number;
    todos: Array<Todo>;
} {
    if (
        responseBody !== null &&
        typeof responseBody === "object" &&
        "todos" in responseBody &&
        "total" in responseBody &&
        "pages" in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            total: Number(responseBody.total),
            pages: Number(responseBody.pages),
            todos: responseBody.todos.map((todo: unknown) => {
                if (todo == null && typeof todo !== "object") {
                    throw new Error("Invalid todo from API");
                }
                const { id, content, date, done } = todo as {
                    id: string;
                    content: string;
                    date: string;
                    done: string;
                };

                return {
                    id,
                    content,
                    done: String(done).toLowerCase() === "true",
                    date: date,
                };
            }),
        };
    }
    return {
        todos: [],
        pages: 1,
        total: 0,
    };
}
