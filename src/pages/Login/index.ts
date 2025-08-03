const { VITE_SPOTIFY_CLIENT_ID, VITE_CLIENT_URL } = import.meta.env;

export const Login = (container: HTMLElement) => {
  container.innerHTML = `
    <button id="loginButton">Login</button>
    <p class="textSecondary">by Spotify</p>
  `;

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
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  const loginButton = container.querySelector("#loginButton")!;

  loginButton.addEventListener("click", handleLogin);
};
