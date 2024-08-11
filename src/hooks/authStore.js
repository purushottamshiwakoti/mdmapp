import { create } from "zustand";

const useAuthStore = create((set) => ({
  fullName: "",
  email: "",
  id: "",
  role: "",
  setUserName: (name) => set({ fullName: name }),
  setUserEmail: (email) => set({ lastName: email }),
  setUserRole: (role) => set({ role: role }),
  setId: (userId) => set({ id: userId }),
  logout: () => set({ id: "", fullName: "", email: "", role: "" }),
}));

export default useAuthStore;
