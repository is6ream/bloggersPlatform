import { PostsQueryRepository} from "../src/posts/infrastructure/postQueryRepository";

decribe("test", () => {
    it("check postView model", async () => {
        const postQueryRepository = new PostsQueryRepository();
        await postQueryRepository.findAll({}, "") //в e2e обратиться через model
    })
}