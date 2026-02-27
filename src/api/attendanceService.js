import axiosClient from "./axiosClient";

export const attendanceService = {

  getAll: () => axiosClient.get("/attendance"),

  markAttendance: (attendanceData) =>
    axiosClient.post("/attendance/mark", attendanceData),

  // UPDATED — handle 404 safely
  getByEmployee: async (empId) => {
    try {
      const res = await axiosClient.get(`/attendance/employee/${empId}`);
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  },

  // UPDATED — same fix
  getMyAttendance: async (empId) => {
    try {
      const res = await axiosClient.get(`/attendance/employee/${empId}`);
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  },

  getByEmployeeAndDate: (empId, date) =>
    axiosClient.get(`/attendance/employee/${empId}/date/${date}`),

  // UPDATED — handle 404 safely
  getByEmployeeMonthYear: async (empId, month, year) => {
    try {
      const res = await axiosClient.get(
        `/attendance/employee/${empId}/month/${month}/year/${year}`
      );
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  },
};