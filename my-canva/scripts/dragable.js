const preview = { x: 0, y: 0, element: null };
let dragged = null;

document.addEventListener("mousedown", dragStart);

document.addEventListener("mousemove", drag);

document.addEventListener("mouseup", dragEnd);

// izaberite stavku za prevlačenje i kreiranje preview-a
function dragStart(e) {
  if (e.target.classList.contains("task")) {
    e.preventDefault();
    e.stopImmediatePropagation();
    dragged = e.target;
    const rect = dragged.getBoundingClientRect();
    const previewElement = dragged.cloneNode(true);
    const clientX = e.clientX;
    const clientY = e.clientY;
    previewElement.classList.add("preview");
    previewElement.style.position = "absolute";
    previewElement.style.top = rect.top + "px";
    previewElement.style.left = rect.left + "px";
    previewElement.style.width = rect.width + "px";
    previewElement.style.height = rect.height + "px";
    previewElement.style.opacity = "0.5";
    document.body.appendChild(previewElement);
    preview.element = previewElement;
    preview.x = dragged.offsetLeft - clientX;
    preview.y = dragged.offsetTop - clientY;
    dragged.classList.add("dragging");
  }
}
// Ažuriranje položaja elementa i pregleda
function drag(e) {
  if (!dragged) return;
  e.preventDefault();
  e.stopImmediatePropagation();

  const clientX = e.clientX;
  const clientY = e.clientY;
  preview.element.style.left = `${clientX + preview.x}px`;
  preview.element.style.top = `${clientY + preview.y}px`;
  const container = containerFromPoint(clientX, clientY);

  if (container) {
    const bottom = insertAboveItem(container, clientY);
    const curr = document.querySelector(".dragging");

    if (!bottom) {
      container.appendChild(curr);
    } else {
      container.insertBefore(curr, bottom);
    }
  }
}

// Očistite prljavštinu
function dragEnd() {
  if (!dragged) return;
  document.body.removeChild(preview.element);
  preview.element = null;
  dragged.classList.remove("dragging");
  dragged = null;
}

// Umetanje iznad najbližeg elementa
function insertAboveItem(container, clientY) {
  const others = container.querySelectorAll(".task:not(dragging)");
  let closest = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  others.forEach((item) => {
    const { top, height } = item.getBoundingClientRect();
    const offset = clientY - top - height / 2;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closest = item;
    }
  });
  return closest;
}

// Izabir tačnog kontejnera na osnovu pozicije kursora
function containerFromPoint(x, y) {
  let stack = [],
    elem = null,
    container = null;
  do {
    elem = document.elementFromPoint(x, y);

    if (elem == null) break;
    stack.push(elem);
    elem.style.pointerEvents = "none";

    if (elem.classList.contains("tasks")) {
      container = elem;
      break;
    }
  } while (elem.tagName != "HTML");

  stack.map((e) => (e.style.pointerEvents = ""));

  return container;
}
