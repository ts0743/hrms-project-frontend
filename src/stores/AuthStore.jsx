import { create } from "zustand";
import { employeeService } from "@/api"; // make sure path is correct

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("hris_user")) || null,
  token: localStorage.getItem("hris_token") || null,
  role: localStorage.getItem("hris_role") || null,
  isAuthenticated: !!localStorage.getItem("hris_token"),

  login: async (data) => {
    console.log("LOGIN DATA:", data);

    // Step 1: Create temporary user object without id
    let user = {
      id: data.id || data.employeeId || null,
      name: data.name || data.username || "",
      email: data.email || "",
      department: data.department || "",
      position: data.position || "",
      role: data.role,
    };

    // Step 2: If no ID, fetch employee info by email
    if (!user.id && user.email) {
      try {
        const employeeData = await employeeService.getByEmail(user.email);

        if (employeeData?.id) {
          user.id = employeeData.id;
          user.name = employeeData.name || user.name;
          user.department = employeeData.department || user.department;
          user.position = employeeData.position || user.position;
        } else {
          console.warn("Employee not found for email:", user.email);
        }
      } catch (err) {
        console.error("Failed to fetch employee info after login", err);
      }
    }

    // Step 3: Store in localStorage
    localStorage.setItem("hris_token", data.token);
    localStorage.setItem("hris_user", JSON.stringify(user));
    localStorage.setItem("hris_role", data.role);

    // Step 4: Update store
    set({
      user,
      token: data.token,
      role: data.role,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("hris_token");
    localStorage.removeItem("hris_user");
    localStorage.removeItem("hris_role");

    set({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
    });
  },

  initialize: () => {
    try {
      const token = localStorage.getItem("hris_token");
      const userStr = localStorage.getItem("hris_user");
      const role = localStorage.getItem("hris_role");

      if (!token || !userStr) return;

      const user = JSON.parse(userStr);

      set({
        user,
        token,
        role,
        isAuthenticated: true,
      });
    } catch (err) {
      console.error("Auth initialization failed", err);
      localStorage.removeItem("hris_token");
      localStorage.removeItem("hris_user");
      localStorage.removeItem("hris_role");
    }
  },
}));

