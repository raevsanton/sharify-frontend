import { store } from "../../store";
import styles from "./success.module.css";

export const Success = (container: HTMLElement) => {
  container.innerHTML = `
    <h2>Successfully</h2>
    <button
      id="openPlaylistButton"
      class=${styles.openPlaylistButton}
    >
      Open
      <img
        class=${styles.openIcon}
        src="assets/img/open.svg"
      />
    </button>
  `;

  const playlistId = store.getState().playlistId;
  const openPlaylistButton = container.querySelector("#openPlaylistButton")!;

  openPlaylistButton.addEventListener("click", () => {
    if (playlistId) {
      window.open(`https://open.spotify.com/playlist/${playlistId}`, "_blank");
    }
  });
};
