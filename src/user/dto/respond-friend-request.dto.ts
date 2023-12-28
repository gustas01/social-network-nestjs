import { IsBoolean, IsNotEmpty, IsUUID } from "class-validator";

export class RespondFriendRequestDto {
  @IsNotEmpty()
  @IsUUID()
  requesterUserId: string

  @IsNotEmpty()
  @IsBoolean()
  response: boolean
}
