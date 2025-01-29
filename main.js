(() => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const clientUrl = import.meta.env.VITE_CLIENT_URL;
  const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

  const playlistNameInput = document.getElementById('playlistName');
  const playlistDescriptionInput = document.getElementById('playlistDescription');
  const playlistPublicCheckbox = document.getElementById('playlistPublic');
  const playlistCreatingForm = document.getElementById('playlistCreatingForm');
  const playlistUpdate = document.getElementById('playlistUpdate');
  const openPlaylistButton = document.getElementById('openPlaylistButton');
  const createPlaylist = document.getElementById('createPlaylist');
  const loginButton = document.getElementById('loginButton');
  const loginBlock = document.getElementById('loginBlock');
  const loader = document.getElementById('loader');
  const errorBlock = document.getElementById('errorBlock');

  let playlistID = null;

  const getTokens = async (code) => {
    loader.style.display = 'block';
    playlistCreatingForm.style.display = 'none';

    try {
      const response = await fetch(`${apiUrl}/auth`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (response.status === 200) {
        loginBlock.style.display = 'none';
        playlistCreatingForm.style.display = 'flex';
      }
    } catch {
      errorBlock.style.display = 'block';
    } finally {
      loader.style.display = 'none';
    }
  }

  const handleLogin = () => {
    const params = new URLSearchParams({
      client_id: spotifyClientId,
      response_type: "code",
      redirect_uri: encodeURI(clientUrl),
      show_dialog: "true",
      scope: [
        "user-library-read",
        "user-read-private",
        "user-read-email",
        "playlist-modify-public",
        "playlist-modify-private"
      ].join(" ")
    });

    window.location.href = `//accounts.spotify.com/authorize?${params.toString()}`;
  };

  const handleCreatePlaylist = async () => {
    loader.style.display = 'block';
    playlistCreatingForm.style.display = 'none';

    try {
      const playlistName = playlistNameInput.value;
      const playlistDescription = playlistDescriptionInput.value;
      const isPlaylistPublic = playlistPublicCheckbox.checked;

      const response = await fetch(`${apiUrl}/playlist`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: playlistName,
          description: playlistDescription,
          is_public: isPlaylistPublic,
        })
      });
      const { playlist_id } = await response.json();

      playlistID = playlist_id;

      playlistUpdate.style.display = 'block';
    } catch {
      errorBlock.style.display = 'block';
    } finally {
      loader.style.display = 'none';
    }
  }

  const validateToken = async () => {
    loader.style.display = 'block';

    try {
      const response = await fetch(`${apiUrl}/auth`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        playlistCreatingForm.style.display = 'flex';
      } else {
        loginBlock.style.display = 'block';
      }
    } catch {
      errorBlock.style.display = 'block';
    } finally {
      loader.style.display = 'none';
    }
  };

  const initializeApp = async () => {
    loginButton.addEventListener('click', handleLogin);
    createPlaylist.addEventListener('click', handleCreatePlaylist);
    openPlaylistButton.addEventListener('click', () =>
      window.open(`//open.spotify.com/playlist/${playlistID}`, '_blank'));

    if (window.location.search) {
      const code = new URLSearchParams(window.location.search).get('code');
      await getTokens(code);
      window.history.replaceState({}, '', window.location.pathname);
    }

    await validateToken()
  };

  document.addEventListener("DOMContentLoaded", initializeApp)
})();
