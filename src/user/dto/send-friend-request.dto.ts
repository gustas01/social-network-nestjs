import { IsNotEmpty, IsUUID } from "class-validator";

export class SendFriendRequestDto {
  @IsNotEmpty()
  @IsUUID()
  addressedUserId: string
}
