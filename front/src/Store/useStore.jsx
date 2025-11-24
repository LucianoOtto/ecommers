import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(persist(
  (set) => ({
    user: { //getter
      email: null,
      full_name: null,
      token: null
    },
    setUser: (newuser) => set({ user: newuser })//setter o modificador
  }), // <- hay una coma
  {// configuracion de persist
    name: "token_login_web"
  }
))