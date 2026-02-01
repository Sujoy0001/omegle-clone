import { create } from "zustand";
import axios from "axios";

const useWakeUpStore = create((set) => ({
  socket: {
    isLoading: false,
    error: null,
    message: null,
  },
  main: {
    isLoading: false,
    error: null,
    message: null,
  },

  socketServerWakeUp: async () => {
    set((state) => ({
      socket: { ...state.socket, isLoading: true, error: null },
    }));

    try {
      const res = await axios.get(import.meta.env.VITE_SERVER_URL);

      set((state) => ({
        socket: {
          ...state.socket,
          isLoading: false,
          message: res.data,
        },
      }));

      return res.data;
    } catch (err) {
      set((state) => ({
        socket: {
          ...state.socket,
          isLoading: false,
          error: err.message,
        },
      }));
      throw err;
    }
  },

  mainServerWakeUp: async () => {
    set((state) => ({
      main: { ...state.main, isLoading: true, error: null },
    }));

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_MAIN_SERVER_URL}/api/v1/isWorking`
      );

      set((state) => ({
        main: {
          ...state.main,
          isLoading: false,
          message: res.data,
        },
      }));

      return res.data;
    } catch (err) {
      set((state) => ({
        main: {
          ...state.main,
          isLoading: false,
          error: err.message,
        },
      }));
      throw err;
    }
  },
}));

export default useWakeUpStore;
