export class AuthDTO {
  constructor(
    public userId: number,
    public access_token: string
  ) {}
}
