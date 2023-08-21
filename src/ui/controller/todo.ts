async function get() {
    return fetch("/api/todos").then(async (responseServer) => {
        const todosString = await responseServer.text();
        const todosFromServer = JSON.parse(todosString).todos;
        return todosFromServer;
    });
}

export const todoController = {
    get,
};
 console.log("TEstando")