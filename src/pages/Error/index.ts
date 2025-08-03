export const Error = (container: HTMLElement) => {
  container.innerHTML = `
    <h2>Something wrong</h2>
    <button
      id="tryAgainButton"
      class="buttonSecondary"
    >
      Try again
    </button>
  `;

  container.querySelector("#tryAgainButton")!.addEventListener("click", () => {
    location.reload();
  });
};
