import { Db } from "mongodb";

export interface CreateUserInpuDto {
  login: string;
  password: string;
  email: string;
}

export interface IUserDB {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

//пример сервиса
export const usersService = {
  async create(dto: CreateUserInpuDto): Promise<string> {
    const { login, email, password } = dto;
    const passwordHash = await bcryptService.generateHash(password);

    const newUser: IUserDB = {
      login,
      email,
      passwordHash,
      createdAt: new Date(),
    };
    const newUserId = await usersRepository.create(newUser);
    return newUserId;
  },
};

//пример хендлера
async (req: RequestWithBody<CreateUserInputDto>, res: Response<IUserView>) => {
  const { login, password, email } = req.body;

  const userId = await usersService.create({ login, password, email }); //создаем с помощью dto
  const newUser = await usersQwRepository.findById(userId); //далее получаем из query репозитория данные

  return res.status(HttpStatuses.Created).send(newUser);
};

type VideoOutputModel = {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
};

type DBVideo = {
  _id: string;
  title: string;
  authorId: string;
};

type DBAuthor = {
  _id: string;
  firstName: string;
  lastName: string;
};

const videoQueryRepo = {
  getVideos(): VideoOutputModel[] {
    const dbVideos: DBVideo[] = [];
    const authors: DBAuthor[] = [];
    return dbVideos.map((dbVideo) => {
      const author = authors.find((a) => a._id === dbVideo.authorId);

      return this.mapToVideoOutputModel(dbVideo, author!);
    });
  },

  getVideoById(id: string): VideoOutputModel {
    const dbVideos: DBVideo = {
      _id: "3334",
      title: "sds",
      authorId: "3232",
    };
    const author: DBAuthor = {
      _id: "32",
      lastName: "da",
      firstName: "das",
    };

    return this.mapToVideoOutputModel(dbVideos, author);
  },

  mapToVideoOutputModel(dbVideo: DBVideo, dbAuthor: DBAuthor) {
    return {
      id: dbVideo._id,
      title: dbVideo.title,
      author: {
        id: dbAuthor!._id,
        name: dbAuthor.firstName + " " + dbAuthor.lastName,
      },
    };
  },
};
