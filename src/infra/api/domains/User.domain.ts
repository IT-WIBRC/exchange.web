import { INull } from "@/infra/utils/types";
import { CreateUserDTO } from "../services";

type LANGUAGE = "FR" | "EN";

export class UserForCreation implements INull {
  isNull = true;
  constructor(private user: CreateUserDTO) {
    this.isNull = false;
  }

  set username(username: string) {
    this.user.username = username;
  }

  set password(password: string) {
    this.user.password = password;
  }

  set email(email: string) {
    this.user.email = email;
  }

  set dateOfBird(dateOfBird: string) {
    this.user.dateOfBird = dateOfBird;
  }

  set lang(lang: LANGUAGE) {
    this.user.lang = CreateUserDTO.lang[lang];
  }

  set profilePicture(profilePicture: string) {
    this.user.profilePicture = profilePicture;
  }

  get dto(): CreateUserDTO {
    return this.user;
  }
}

export const newNullUserForCreation = (): UserForCreation => {
  const userForCreation = new UserForCreation({} as CreateUserDTO);
  userForCreation.isNull = true;
  return userForCreation;
};
