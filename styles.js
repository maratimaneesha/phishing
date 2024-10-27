// src/styles.js
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('button[aria-label="Menu"]');
  const sidebar = document.querySelector('.sidebar');

  // Ensure elements are present
  if (menuButton && sidebar) {
      menuButton.addEventListener('click', () => {
          sidebar.classList.toggle('collapse');
      });
  } else {
      console.error('Menu button or sidebar not found');
  }
});
