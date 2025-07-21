interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CLIENT_URL: string;
  readonly VITE_SPOTIFY_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
