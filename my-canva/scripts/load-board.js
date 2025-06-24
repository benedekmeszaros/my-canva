init();

// Inicijalizacija
function init() {
  const dropdown = document.querySelector("app-dropdown");
  const password = document.getElementById("load-password");
  const loadButton = document.getElementById("btn-load");

  password.oninvalid = passwordValidation;
  password.oninput = passwordValidation;

  loadButton.disabled = true;
  dropdown.addEventListener("change-item", (e) => {
    if (e.detail.password) {
      password.classList.remove("hidden");
      password.setAttribute("required", true);
    } else {
      password.classList.add("hidden");
      password.removeAttribute("required");
      password.setCustomValidity("");
      password.value = "";
    }
    loadButton.disabled = false;
  });
}

// Prikaz form
function showLoadForm() {
  refresh();
  document.getElementById("load-form").style.display = "flex";
}

//Skrij form
function hideLoadForm() {
  document.getElementById("load-form").style.display = "none";
}

// Azuriranje podaci
function refresh() {
  const boardes = JSON.parse(window.localStorage.getItem("boards")) ?? [];
  const dropdown = document.querySelector("app-dropdown");
  dropdown.setOptions(boardes);
  const password = document.getElementById("load-password");
  password.classList.add("hidden");
  password.removeAttribute("required");
  password.setCustomValidity("");
  password.value = "";
}

// Opterećenje tabela
function load(e) {
  e.preventDefault();
  const dropdown = document.querySelector("app-dropdown");
  const password = document.getElementById("load-password");
  const selected = dropdown.selected;

  if (selected) {
    if (selected.password) {
      if (selected.password === password.value) {
        renderBoard(selected);
        hideLoadForm();
      }
    } else {
      renderBoard(selected);
      hideLoadForm();
    }
  }
}

// Validacija - password
function passwordValidation() {
  const password = document.getElementById("load-password");
  const dropdown = document.querySelector("app-dropdown");
  const validity = password.validity;
  if (password.classList.contains("hidden")) password.setCustomValidity("");
  else if (validity.valueMissing)
    password.setCustomValidity(
      "You must enter the password before accessing the board!"
    );
  else if (password.value !== dropdown.selected.password)
    password.setCustomValidity("Incorrect password!");
  else password.setCustomValidity("");
}
