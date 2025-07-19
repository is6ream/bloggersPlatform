export class RepositoryNotFoundError extends Error {
  constructor(
    message: string,
    public readonly field: string,
  ) {
    super(message);
  }
}
