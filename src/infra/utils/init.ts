import { OpenAPI } from "../api/services";

function setRequestToken(accessToken: string) {
  OpenAPI.HEADERS = {
    ...OpenAPI.HEADERS,
    Authorization: accessToken ? `Exchange ${accessToken}` : "",
  };
}

function setApiUrl() {
  OpenAPI.BASE = import.meta.env.VITE_API_URL;
}

export const InitApi = {
  setApiUrl,
  setRequestToken,
};
