import axiosClient from "./axiosClient";

export const employeeService = {
  // Get all employees
  getAll: () => axiosClient.get("/employee"),

  // Get employee list (projection)
  getEmployeeList: () => axiosClient.get("/employee/list"),

  // Get employee by ID
  getById: (id) => axiosClient.get(`/employee/${id}`),

  // Create employee
  createEmployee: (data) => axiosClient.post("/employee", data),

  // send ID in URL
  updateEmployee: (data) =>
    axiosClient.put(`/employee/${data.id}`, data),

  // Delete employee
  deleteEmployee: (id) => axiosClient.delete(`/employee/${id}`),
};