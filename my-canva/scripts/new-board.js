let takenTitles = [];

init();

// Inicializacija
function init() {
  const title = document.getElementById("title");

  title.oninvalid = titleValidation;
  title.oninput = titleValidation;

  const allias = document.getElementById("allias");

  allias.oninvalid = alliasValidation;
  allias.oninput = alliasValidation;

  const isPrivate = document.getElementById("private");
  const password = document.getElementById("new-password");

  password.oninvalid = passwordValidation;
  password.oninput = passwordValidation;

  if (!isPrivate.checked) {
    password.removeAttribute("required");
    password.classList.add("hidden");
  } else {
    password.classList.remove("hidden");
    password.setAttribute("required", true);
  }

  isPrivate.addEventListener("change", (e) => {
    if (!e.target.checked) {
      password.classList.add("hidden");
      password.removeAttribute("required");
      password.setCustomValidity("");
    } else {
      password.classList.remove("hidden");
      password.setAttribute("required", true);
    }
  });
}

// Prikaz form
function showCreateForm() {
  clearInputs();
  takenTitles = (JSON.parse(window.localStorage.getItem("boards")) ?? []).map(
    (board) => board.title
  );
  document.getElementById("create-form").style.display = "flex";
}

// Skrij form
function hideCreateForm() {
  document.getElementById("create-form").style.display = "none";
  showLoadForm();
}

function clearInputs() {
  const password = document.getElementById("new-password");
  password.value = "";
  password.classList.add("hidden");
  password.removeAttribute("required");
  document.getElementById("private").checked = false;
  document.getElementById("title").value = "";
  document.getElementById("allias").value = "";
}

// Validacija - title
function titleValidation() {
  const title = document.getElementById("title");
  const validity = title.validity;
  if (validity.valueMissing)
    title.setCustomValidity("You must define a title!");
  else if (validity.patternMismatch)
    title.setCustomValidity(
      "The title can contain both uppercase and lowercase letters as well as digits, and the title must start with a letter."
    );
  else if (validity.tooShort)
    title.setCustomValidity("The title must be at least 3 characters long.");
  else if (validity.tooLong)
    title.setCustomValidity("The title must be less than 65 characters.");
  else if (takenTitles.includes(title.value))
    title.setCustomValidity(`Title "${title.value}" is already taken.`);
  else title.setCustomValidity("");
}

// Validacija - allias
function alliasValidation() {
  const allias = document.getElementById("allias");
  const validity = allias.validity;
  if (validity.valueMissing)
    allias.setCustomValidity("You must define an allias!");
  else if (validity.patternMismatch)
    allias.setCustomValidity(
      "The allias can contain both uppercase and lowercase letters as well as digits, and the allias must start with a letter."
    );
  else if (validity.tooShort)
    allias.setCustomValidity("The allias must be at least 3 characters long.");
  else if (validity.tooLong)
    allias.setCustomValidity("The allias must be less than 65 characters.");
  else allias.setCustomValidity("");
}

// Vallidacija - password
function passwordValidation() {
  const password = document.getElementById("new-password");
  if (!document.getElementById("private").checked) {
    password.setCustomValidity("");
    return;
  }
  const validity = password.validity;
  if (validity.valueMissing)
    password.setCustomValidity("You must set a password!");
  else if (validity.patternMismatch)
    password.setCustomValidity(
      "Password must contain a capital letter, one number and be at least 8 characters long."
    );
  else password.setCustomValidity("");
}

// Creiranje novo tabela
function create(e) {
  e.preventDefault();
  const isPrivate = document.getElementById("private");
  const password = document.getElementById("new-password");
  const title = document.getElementById("title");
  const allias = document.getElementById("allias");
  const board = {
    title: title.value,
    allias: allias.value,
    lists: [
      {
        name: "TODO",
        tasks: [],
      },
      {
        name: "Doing",
        tasks: [],
      },
      {
        name: "Done",
        tasks: [],
      },
    ],
  };
  if (isPrivate.checked) board.password = password.value;

  const boardes = JSON.parse(window.localStorage.getItem("boards")) ?? [];
  boardes.push(board);
  window.localStorage.setItem("boards", JSON.stringify(boardes));
  hideCreateForm();
}
