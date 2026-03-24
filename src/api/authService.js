import axiosClient from "./axiosClient";

export const authService = {

  login: (data) => axiosClient.post("/user/login", data),

  register: async (data) => {
    try {
      const response = await axiosClient.post("/register", data);
      return response;
    } catch (error) {

      if (error.response && error.response.data) {

        if (error.response.data.includes("User already exists")) {
          alert("User already exists. Please use another email.");
        } 
        else if (error.response.data.includes("Username already exists")) {
          alert("Username already exists. Choose another username.");
        } 
        else {
          alert(error.response.data);
        }

      } else {
        alert("Server error. Please try again.");
      }

      throw error;
    }
  }
};