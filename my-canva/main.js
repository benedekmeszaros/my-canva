// Inicializacija
function main() {
  showLoadForm();
  document.querySelector("app-dropdown").addEventListener("new-item", () => {
    showCreateForm();
    hideLoadForm();
  });
}
