import { initApp } from "./app";
import { store } from "./store";
const { VITE_API_URL } = import.meta.env;

const getTokens = async (code: string | null) => {
  if (!code) return;

  try {
    const res = await fetch(`${VITE_API_URL}/auth`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const statusActions: Record<number, () => void> = {
      200: () => store.setState({ page: "playlist" }),
      401: () => store.setState({ page: "login" }),
    };

    (statusActions[res.status] ?? store.setState({ page: "error" }))();
  } catch {
    store.setState({ page: "error" });
  }
};

const validateToken = async () => {
  try {
    const res = await fetch(`${VITE_API_URL}/auth`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const statusActions: Record<number, () => void> = {
      200: () => store.setState({ page: "playlist" }),
      401: () => store.setState({ page: "login" }),
    };

    (statusActions[res.status] ?? store.setState({ page: "error" }))();
  } catch {
    store.setState({ page: "error" });
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const code = new URLSearchParams(window.location.search).get("code");

  if (code) {
    await getTokens(code);
    window.history.replaceState({}, "", window.location.pathname);
  }

  await initApp();
  await validateToken();
});
