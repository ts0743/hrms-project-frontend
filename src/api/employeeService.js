import axiosClient from "./axiosClient";

export const employeeService = {
  getAll: () => axiosClient.get("/employee"),

  getEmployeeList: () => axiosClient.get("/employee/list"),

  getById: (id) => axiosClient.get(`/employee/${id}`),

  getByEmail: (email) =>
    axiosClient.get(`/employee/email`, {
      params: { email },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("hris_token")}`,
      },
    }),

  createEmployee: (data) => axiosClient.post("/employee", data),

  updateEmployee: (data) => axiosClient.put(`/employee/${data.id}`, data),

  deleteEmployee: (id) => axiosClient.delete(`/employee/${id}`),
};