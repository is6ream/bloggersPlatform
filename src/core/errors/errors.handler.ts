// import { HttpStatus } from "./../http-statuses";
// import { Response } from "express";
// import { RepositoryNotFoundError } from "./repository-not-found.error";
// import { createErrorMessages } from "./create-error-message";

// export function errorsHandler(error: unknown, res: Response): void {
//   if (error instanceof RepositoryNotFoundError) {
//     const httpStatus = HttpStatus.NotFound;

//     res.status(httpStatus).send(
//       createErrorMessages([
//         {
//           field: error.field, //тут может быть ошибка, из-за неправильного добавления нового свойства
//           message: error.message,
//         },
//       ]),
//     );
//     return;
//   }
//   res.status(HttpStatus.InternalServerError);
//   return;
// }
