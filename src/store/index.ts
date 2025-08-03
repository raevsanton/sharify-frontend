type PathPages = "playlist" | "error" | "loading" | "login" | "success";

type AppState = {
  page: PathPages;
  playlistId: string | null;
};

type Listener = (state: AppState) => void;

const initialState: AppState = {
  page: "loading",
  playlistId: null,
};

let state: AppState = { ...initialState };
const listeners: Listener[] = [];

export const store = {
  getState: () => state,
  setState: (partial: Partial<AppState>) => {
    state = { ...state, ...partial };
    listeners.forEach((l) => l(state));
  },
  subscribe: (listener: Listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  },
};
