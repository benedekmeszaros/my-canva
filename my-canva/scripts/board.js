// Napravi tabela
function renderBoard(value) {
  const board = document.querySelector(".board");
  board.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = value.title;
  board.appendChild(title);

  const allias = document.createElement("p");
  allias.textContent = value.allias;
  board.appendChild(allias);

  const buttonDiv = document.createElement("div");
  buttonDiv.style.display = "flex";
  buttonDiv.style.gap = "10px";
  board.appendChild(buttonDiv);

  const backButton = document.createElement("button");
  backButton.classList.add("btn");
  backButton.textContent = "Back";
  backButton.onclick = hideBoard;
  buttonDiv.appendChild(backButton);

  const saveButton = document.createElement("button");
  saveButton.classList.add("btn");
  saveButton.textContent = "Save";
  saveButton.onclick = save;
  buttonDiv.appendChild(saveButton);

  const revertButton = document.createElement("button");
  revertButton.classList.add("btn");
  revertButton.textContent = "Revert";
  revertButton.onclick = revert;
  buttonDiv.appendChild(revertButton);

  const grid = document.createElement("div");
  grid.classList.add("grid");
  board.appendChild(grid);

  value.lists.forEach((l) => {
    const list = document.createElement("div");
    list.classList.add("list");

    const listName = document.createElement("h3");
    listName.textContent = l.name;
    list.appendChild(listName);

    const tasks = document.createElement("div");
    tasks.classList.add("tasks");
    list.appendChild(tasks);

    l.tasks.forEach((t) => {
      const task = document.createElement("div");
      task.classList.add("task");
      tasks.appendChild(task);
      const label = document.createElement("p");
      label.textContent = t;
      label.style.pointerEvents = "none";
      task.appendChild(label);
      const removeButton = document.createElement("button");
      removeButton.textContent = "X";
      removeButton.classList.add("btn-remove");
      removeButton.addEventListener("click", () => {
        task.parentElement.removeChild(task);
      });
      task.appendChild(removeButton);
    });

    const newTask = document.createElement("form");
    newTask.classList.add("new-task");

    const taskInput = document.createElement("input");
    taskInput.setAttribute("type", "text");
    taskInput.setAttribute("placeholder", "Task");
    newTask.appendChild(taskInput);

    const addButton = document.createElement("input");
    addButton.setAttribute("type", "submit");
    addButton.value = "Add";
    newTask.appendChild(addButton);

    const cancleButton = document.createElement("input");
    cancleButton.setAttribute("type", "button");
    cancleButton.value = "Cancel";
    newTask.appendChild(cancleButton);

    newTask.style.display = "none";
    list.appendChild(newTask);

    const addTaskButton = document.createElement("button");
    addTaskButton.classList.add("btn-add-task");
    addTaskButton.textContent = "+Add Task";
    addTaskButton.addEventListener("click", () => {
      addTaskButton.style.display = "none";
      newTask.style.display = "flex";
      addButton.disabled = true;
      taskInput.focus();
    });

    taskInput.addEventListener("input", () => {
      addButton.disabled = taskInput.value.length === 0;
    });

    addButton.addEventListener("click", (e) => {
      e.preventDefault();
      const task = document.createElement("div");
      task.classList.add("task");
      tasks.appendChild(task);
      const label = document.createElement("p");
      label.textContent = taskInput.value;
      label.style.pointerEvents = "none";
      task.appendChild(label);
      addTaskButton.style.display = "block";
      newTask.style.display = "none";
      taskInput.value = "";
      const removeButton = document.createElement("button");
      removeButton.textContent = "X";
      removeButton.classList.add("btn-remove");
      removeButton.addEventListener("click", () => {
        task.parentElement.removeChild(task);
      });
      task.appendChild(removeButton);
    });

    cancleButton.addEventListener("click", () => {
      addTaskButton.style.display = "block";
      newTask.style.display = "none";
      taskInput.value = "";
    });

    list.appendChild(addTaskButton);
    grid.appendChild(list);
  });
}

// Sacuvaj promene
function save() {
  const boardes = JSON.parse(window.localStorage.getItem("boards")) ?? [];
  const board = document.querySelector(".board");
  const lists = board.querySelectorAll(".list");
  const title = board.querySelector("h2").textContent;
  const target = boardes.find((b) => b.title == title);

  lists.forEach((list, i) => {
    const tasks = [...list.querySelectorAll(".task > p")].map(
      (t) => t.textContent
    );
    target.lists[i] = { ...target.lists[i], tasks };
  });

  window.localStorage.setItem("boards", JSON.stringify(boardes));
}

// Vrati promene
function revert() {
  const boardes = JSON.parse(window.localStorage.getItem("boards")) ?? [];
  const board = document.querySelector(".board");
  const title = board.querySelector("h2").textContent;
  const target = boardes.find((b) => b.title == title);
  renderBoard(target);
}

// Skrij tabela
function hideBoard() {
  const board = document.querySelector(".board");
  board.innerHTML = "";
  showLoadForm();
}
