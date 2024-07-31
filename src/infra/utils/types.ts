export interface INull {
  isNull: boolean;
}

export type ApiError = {
  message: string;
};

export enum StorageLocal {
  AUTH_USER = "auth-user",
  USER_ROLE = "user-role",
  PREVIOUS_PATH = "previous-path",
}
