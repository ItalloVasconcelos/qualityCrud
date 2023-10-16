import { z as schema } from "zod";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export const TodoSchema = schema.object({
    id: schema.string().uuid(),
    content: schema.string().min(1),
    date: schema.string().datetime(),
    done: schema.boolean(),
});

export type Todo = schema.infer<typeof TodoSchema>;

export function formatTodoDate(todo: Todo): string {
    const parsedDate = new Date(todo.date);
    const timeZone = "America/Sao_Paulo";
    const zonedDate = utcToZonedTime(parsedDate, timeZone);
    const formattedDate = format(zonedDate, "HH:mm  dd/MM");
    return formattedDate;
}
