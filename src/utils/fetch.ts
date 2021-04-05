import axios from "axios";
import { apiURL } from "../utils/constants";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const fetchAuth = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

const refreshAuthLogic = (failedRequest: unknown) =>
  axios({
    url: `${apiURL}/users/refreshToken`,
    method: "POST",
    withCredentials: true,
  }).then((tokenRefreshResponse) => {
    return Promise.resolve();
  });
createAuthRefreshInterceptor(axios, refreshAuthLogic);

export default fetchAuth;

export const fetchBe = axios.create({
  baseURL: apiURL,
});
