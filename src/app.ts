import { Error } from "./pages/Error";
import { Loader } from "./pages/Loader";
import { Login } from "./pages/Login";
import { Playlist } from "./pages/Playlist";
import { Success } from "./pages/Success";
import { store } from "./store";

const main = document.querySelector("main")!;

const renderContent: Record<string, (container: HTMLElement) => void> = {
  login: Login,
  playlist: Playlist,
  success: Success,
  error: Error,
  loading: Loader,
};

const render = (state: ReturnType<typeof store.getState>) => {
  const renderElement = renderContent[state.page];

  if (renderElement) {
    renderElement(main);
  } else {
    main.innerHTML = "<h2>Page not found</h2>";
  }
};

export const initApp = async () => {
  render(store.getState());
  store.subscribe(render);
};
