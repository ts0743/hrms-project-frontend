import axiosClient from "./axiosClient";

export const leaveService = {

  // GET ALL LEAVES
  getAll: async () => {
    const res = await axiosClient.get("/employeeLeave");
    return res.data;
  },

  // APPLY LEAVE
  applyLeave: async (data) => {
    const res = await axiosClient.post("/employeeLeave", data);
    return res.data;
  },

  // GET LEAVES BY EMPLOYEE (UPDATED - HANDLE 404 SAFELY)
  getByEmployee: async (empId) => {
    try {
      const res = await axiosClient.get(`/employeeLeave/employee/${empId}`);
      return res.data;
    } catch (err) {
      // if no leaves exist, return empty array instead of crashing UI
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  },

  // APPROVE LEAVE (matches backend)
  approve: async (leaveId) => {
    const res = await axiosClient.put(`/employeeLeave/approve/${leaveId}`);
    return res.data;
  },

  // REJECT LEAVE (matches backend + query param)
  reject: async (leaveId, reason) => {
    const res = await axiosClient.put(
      `/employeeLeave/reject/${leaveId}?reason=${encodeURIComponent(reason)}`
    );
    return res.data;
  },

};