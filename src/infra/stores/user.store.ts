import { defineStore } from "pinia";
import { UserForCreation } from "@/infra/api/domains/User.domain";
import { UserService } from "@/infra/api/services";
import { ApiError } from "@/infra/utils/types";

type State = {
  user: Record<string, unknown>;
  apiError: ApiError;
};

export const useUserStore = defineStore("user", {
  state: (): State => ({
    user: {},
    apiError: {
      message: "",
    },
  }),
  actions: {
    onApiError(error: unknown) {
      if ((error as { body: unknown }).body) {
        this.apiError.message = (error as { body: ApiError }).body.message;
      } else {
        this.apiError = {
          message: "Unknown",
        };
        console.error(error);
      }
    },
    async createUserAccount(user: UserForCreation): Promise<void> {
      try {
        await UserService.registration({
          requestBody: user.dto,
        });
      } catch (error: unknown) {
        this.onApiError(error);
      }
    },
    async enableUser(code: string, email: string): Promise<void> {
      try {
        await UserService.enableUser({
          requestBody: {
            code,
            email,
          },
        });
      } catch (error: unknown) {
        this.onApiError(error);
      }
    },
    async resendOtp(email: string): Promise<void> {
      try {
        await UserService.resendOtp({
          requestBody: {
            email,
          },
        });
      } catch (error: unknown) {
        this.onApiError(error);
      }
    },
  },
});
