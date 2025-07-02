import { body } from "express-validator";
import { authColletction } from "../../db/mongo.db";

export const loginOrEmailValidator = body("loginOrEmail")
  .trim()
  .notEmpty()
  .withMessage("Требуется логин или email")
  .custom(async (value, { req }) => {
    const isEmail = value.includes("@");

    const user = await authColletction.findOne({
      $or: [{ login: value }, { email: value }],
    });

    if (!user) {
      throw new Error("Неверные учетные данные");
    }
    req.user = user;
    return true;
  });
//вопрос, как

export const passwordValidation = body("password")
  .exists()
  .withMessage("field password is required")
  .isString()
  .withMessage("field password must be a string")
  .isLength({ min: 6, max: 20 })
  .withMessage("more then 20 or 6");

export const authValidators = [loginOrEmailValidator, passwordValidation];
