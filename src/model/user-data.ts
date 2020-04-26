export interface UserData{
  userNum: string;
  userId: string;
  password: string;
}

export class UserDataImpl implements UserData{
  userNum: string = '';
  userId: string = '';
  password: string = '';
}
