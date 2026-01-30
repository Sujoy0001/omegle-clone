import { create } from "zustand";
import axios from "axios";

const useWakeUpStore = create((set) => ({
    isLoading: false,
    message: null,
    error: null,
    socketServerWakeUp: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}`);
            if (response.data) {
                set({ message: response.data, isLoading: false });
                return response.data;
            } else {
                set({ isLoading: false, error: "No data received from server" });
                throw new Error("No data received from server");
            }
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },
    mainServerWakeUp: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${import.meta.env.VITE_MAIN_SERVER_URL}/api/v1/isWorking`);
            if (response.data) {
                set({ message: response.data, isLoading: false });
                return response.data;
            } else {
                set({ isLoading: false, error: "No data received from server" });
                throw new Error("No data received from server");
            }
        } catch (error) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    }
}));

export default useWakeUpStore;