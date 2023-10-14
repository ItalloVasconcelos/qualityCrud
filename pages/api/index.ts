// import { todoController } from "@server/controller/todo";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//     request: NextApiRequest,
//     response: NextApiResponse
// ) {
//     if (request.method === "GET") {
//         await todoController.get(request, response);
//     }

//     response.status(405).json({
//         message: "Method not allowed",
//         error: {
//             message: "Method not allowed",
//         },
//     });
// }

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    // eslint-disable-next-line no-console
    console.log(request.headers);
    response.status(200).json({ message: "Olá mundo!" });
}
