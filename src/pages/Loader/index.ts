import styles from "./loader.module.css";

export const Loader = (container: HTMLElement) => {
  container.innerHTML = `
    <div class="${styles.loader}">
      <div class="${styles.bounce} ${styles.bounce1}"></div>
      <div class="${styles.bounce} ${styles.bounce2}"></div>
      <div class="${styles.bounce} ${styles.bounce3}"></div>
    </div>
  `;
};
