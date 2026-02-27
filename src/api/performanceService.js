import axiosClient from "./axiosClient";

export const performanceService = {
  // Get all performance reviews
  getAll: () => axiosClient.get("/performance"),

  // Get performance by employee ID
  getByEmployee: (empId) => axiosClient.get(`/performance/employee/${empId}`),

  // Get performance by employee ID and year
  getByEmployeeAndYear: (empId, year) =>
    axiosClient.get(`/performance/employee/${empId}/year/${year}`),

  // Get projection list of all performance
  getList: () => axiosClient.get("/performance/list"),

  // Get projection list by employee
  getListByEmployee: (empId) => axiosClient.get(`/performance/list/employee/${empId}`),

  // Add a new performance review
  create: (reviewData) => axiosClient.post("/performance", reviewData),

  // Update performance review (HR/Admin only)
  update: (empId, reviewData) => axiosClient.put(`/performance/employee/${empId}`, reviewData),
}