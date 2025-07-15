import { ObjectId } from "mongodb";
import { authCollection } from "../../db/mongo.db";

export type AuthResult = {
  id: string;
  loginOrEmail: string;
  password: string;
};

export const authQueryRepository = {
  async findById(id: ObjectId): Promise<AuthResult | null> {
    const auth = await authCollection.findOne({ _id: new ObjectId(id) });

    if (!auth) {
      return null;
    }
    return {
      id: auth._id.toString(),
      loginOrEmail: auth.loginOrEmail,
      password: auth.passwordHash,
    };
  },
};


/*При реализации данного эндпоинта в BLL мы будем делать запрос к репозиторию users, далее, нужно прописать логику проверки email, 
а также проверить хеш пароля, используя bcrypt compare. authRepo здесь абсолютно не требуется
*/