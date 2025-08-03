import { store } from "../../store";
import styles from "./playlists.module.css";

const { VITE_API_URL } = import.meta.env;

export const Playlist = (container: HTMLElement) => {
  container.innerHTML = `
    <form class="${styles.playlists}">
      <h2>New playlist</h2>
      <input
        type="text"
        placeholder="Name"
        id="playlistName"
        class="${styles.playlistName}"
        required
      />
      <input
        type="text"
        placeholder="Description"
        id="playlistDescription"
      />
      <div>
        <input id="isPublicPlaylist" type="checkbox" />
        <label for="isPublicPlaylist">Make public</label>
      </div>
      <button id="createPlaylistButton" type="submit" disabled>
        Create
      </button>
    </form>
  `;

  const toggleCreateButton = () => {
    const isNameFilled = playlistNameInput.value.trim().length > 0;
    createPlaylistButton.disabled = !isNameFilled;
  };

  const handleCreatePlaylist = async () => {
    store.setState({ page: "loading" });

    try {
      const res = await fetch(`${VITE_API_URL}/playlist`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playlistNameInput.value,
          description: playlistDescriptionInput.value,
          is_public: isPublicPlaylistCheckbox.checked,
        }),
      });

      if (!res.ok) throw new Error();

      const { playlist_id } = await res.json();
      store.setState({ playlistId: playlist_id, page: "success" });
    } catch {
      store.setState({ page: "error" });
    }
  };

  const createPlaylistButton = container.querySelector(
    "#createPlaylistButton"
  ) as HTMLButtonElement;
  const playlistNameInput = document.getElementById(
    "playlistName"
  ) as HTMLInputElement;
  const playlistDescriptionInput = document.getElementById(
    "playlistDescription"
  ) as HTMLInputElement;
  const isPublicPlaylistCheckbox = document.getElementById(
    "isPublicPlaylist"
  ) as HTMLInputElement;

  createPlaylistButton.addEventListener("click", handleCreatePlaylist);
  playlistNameInput.addEventListener("input", toggleCreateButton);
};
