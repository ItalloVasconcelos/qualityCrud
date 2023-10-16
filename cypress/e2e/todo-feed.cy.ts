const BASE_URL = "http://localhost:3000";
describe("/ - Todos Feed", () => {
    it("when load, renders the page", () => {
        cy.visit(BASE_URL);
    });
    it("when create a new todo, it must appears in the screen", () => {
        //Isolar teste, para ser limitado apenas ao front.
        cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
            request.reply({
                statusCode: 201,
                body: {
                    todo: {
                        id: "5df28534-0a99-4083-918b-6f2b50b949fb",
                        date: "2023-10-01T20:07:54.829Z",
                        content: "Test Todo",
                        done: false,
                    },
                },
            });
        }).as("createTodo");
        cy.visit(BASE_URL);
        const inputAddTodo = "input[name='add-todo-input'";

        cy.get(inputAddTodo).type("Test Todo");

        const btnAddTodo = "[aria-label='Adicionar novo item']";

        cy.get(btnAddTodo).click();

        cy.get("table > tbody").contains("Test Todo");
    });
});
