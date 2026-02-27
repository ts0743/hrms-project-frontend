import axiosClient from "./axiosClient";

export const authService = {
  login: (data) => axiosClient.post("/login", data),
  register: (data) => axiosClient.post("/register", data),
};

