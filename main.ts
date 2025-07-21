(() => {
  const { VITE_API_URL, VITE_CLIENT_URL, VITE_SPOTIFY_CLIENT_ID } = import.meta
    .env;

  const $ = <T extends HTMLElement>(id: string): T =>
    document.getElementById(id) as T;

  const playlistNameInput = $("playlistName") as HTMLInputElement;
  const playlistDescriptionInput = $("playlistDescription") as HTMLInputElement;
  const playlistPublicCheckbox = $("playlistPublic") as HTMLInputElement;
  const playlistCreatingForm = $("playlistCreatingForm");
  const playlistUpdate = $("playlistUpdate");
  const openPlaylistButton = $("openPlaylistButton") as HTMLButtonElement;
  const createPlaylist = $("createPlaylist") as HTMLButtonElement;
  const loginButton = $("loginButton") as HTMLButtonElement;
  const loginBlock = $("loginBlock");
  const loader = $("loader");
  const errorBlock = $("errorBlock");

  let playlistID: string | null = null;

  const getTokens = async (code: string | null) => {
    if (!code) return;

    loader.style.display = "block";
    playlistCreatingForm.style.display = "none";

    try {
      const res = await fetch(`${VITE_API_URL}/auth`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (res.status === 200) {
        loginBlock.style.display = "none";
        playlistCreatingForm.style.display = "flex";
      }
    } catch {
      errorBlock.style.display = "block";
    } finally {
      loader.style.display = "none";
    }
  };

  const handleLogin = () => {
    const params = new URLSearchParams({
      client_id: VITE_SPOTIFY_CLIENT_ID,
      response_type: "code",
      redirect_uri: encodeURI(VITE_CLIENT_URL),
      show_dialog: "true",
      scope: [
        "user-library-read",
        "user-read-private",
        "user-read-email",
        "playlist-modify-public",
        "playlist-modify-private",
      ].join(" "),
    });

    window.location.href = `//accounts.spotify.com/authorize?${params.toString()}`;
  };

  const handleCreatePlaylist = async () => {
    loader.style.display = "block";
    playlistCreatingForm.style.display = "none";

    try {
      const response = await fetch(`${VITE_API_URL}/playlist`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playlistNameInput.value,
          description: playlistDescriptionInput.value,
          is_public: playlistPublicCheckbox.checked,
        }),
      });

      const { playlist_id } = await response.json();
      playlistID = playlist_id;
      playlistUpdate.style.display = "block";
    } catch {
      errorBlock.style.display = "block";
    } finally {
      loader.style.display = "none";
    }
  };

  const validateToken = async () => {
    loader.style.display = "block";

    try {
      const res = await fetch(`${VITE_API_URL}/auth`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        playlistCreatingForm.style.display = "flex";
      } else {
        loginBlock.style.display = "block";
      }
    } catch {
      errorBlock.style.display = "block";
    } finally {
      loader.style.display = "none";
    }
  };

  const initializeApp = async () => {
    loginButton.addEventListener("click", handleLogin);
    createPlaylist.addEventListener("click", handleCreatePlaylist);
    openPlaylistButton.addEventListener("click", () => {
      if (playlistID) {
        window.open(`//open.spotify.com/playlist/${playlistID}`, "_blank");
      }
    });

    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      await getTokens(code);
      window.history.replaceState({}, "", window.location.pathname);
    }

    await validateToken();
  };

  document.addEventListener("DOMContentLoaded", initializeApp);
})();
