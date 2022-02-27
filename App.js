/* Setting list of todos to the localStorage */
// localStorage.clear();
if (!localStorage.todos) {
  localStorage.todos = JSON.stringify([
    {
      task: "Try this nice and simple todo list",
      completed: false,
    },
    {
      task: "You could add, remove, edit and rearrange items",
      completed: false,
    },
    {
      task: "All your todos are saved to the your local storage so feel free to refresh your browser anytime",
      completed: false,
    },
    {
      task: "Wish you many completed tasks!",
      completed: false,
    },
  ]);
}

/* reading todos from localStorage */
const todos = JSON.parse(localStorage.todos);

/* adding todos to UI */
const todoList = document.getElementById("todo-list");
for (const [i, todo] of todos.entries()) {
  addTodo(todo, i * 100);
}

/* handling new task addition */
document.getElementById("add").addEventListener("click", handleSubmit);
const inputTask = document.getElementById("task");
function handleSubmit(event) {
  event.preventDefault();
  const task = inputTask.value.trim();
  if (task === "") return;
  addTodo({ task: task, completed: false });
  inputTask.value = "";
  /* saving todos */
  saveToLocalStorage();
}

/**
 * Appends a new todo to the list.
 * @param {Object} todo - A todo specification.
 * @param {string} todo.task - A todo text.
 * @param {boolean} todo.completed - Is it completed or not.
 * @param {number} delay - Delay time (ms) before showing new todo.
 */
function addTodo(todo, delay = 0) {
  /* creating a new <to-do> element */
  const newTodo = document.createElement("to-do");
  newTodo.append(todo.task); // text node
  newTodo.completed = todo.completed;
  /* handling events */
  newTodo.addEventListener("completed", saveToLocalStorage);
  newTodo.addEventListener("grab", startDrag);
  newTodo.addEventListener("delete", deleteTodo);
  newTodo.addEventListener("editend", saveToLocalStorage);
  /* adding some (not so) fancy animation */
  newTodo.classList.add("before-appearance", "appearable");
  setTimeout(() => {
    newTodo.classList.remove("before-appearance");
  }, delay);
  newTodo.addEventListener(
    "transitionend",
    (e) => e.target.classList.remove("appearable"),
    { once: true }
  );
  /* and appending to the DOM */
  todoList.append(newTodo);
}

// currently dragged Todo
let draggedTodo; // todo being dragged
let draggedIndex; // its index in todoList.children
let grabCoordinates; // coordinates of mousedown "grab" event
let draggedRect; // getBoundingClientRect()

function startDrag(event) {
  draggedTodo = event.target;
  draggedIndex = Array.from(todoList.children).indexOf(draggedTodo);
  grabCoordinates = { x: event.clientX, y: event.clientY };
  draggedRect = draggedTodo.getBoundingClientRect();

  draggedTodo.classList.add("grabbed");
  window.addEventListener("mousemove", dragging);
  window.addEventListener("mouseup", stopDrag, { once: true });
}

/**
 *
 * @param {MouseEvent} event
 */
function dragging(event) {
  /**
   * The following stuff works in Firefox, but not in the Chrome and Edge.
   *
   * const style = window.getComputedStyle(draggedTodo);
   * draggedTodo.style.left = `calc(${style.left} + ${event.movementX}px)`;
   * draggedTodo.style.top = `calc(${style.top} + ${event.movementY}px)`;
   *
   * However, if we divide `movementX` and `movementY` properties by `window.devicePixelRatio`
   * everything works fine in both Chrome and Edge, but not in Firefox.
   *
   * https://stackoverflow.com/questions/71194670
   */
  /* reaching the todo which is below dragged one */
  const belowTodo = document.elementFromPoint(event.clientX, event.clientY);
  /* processing swapping */
  if (
    belowTodo?.tagName === "TO-DO" &&
    !belowTodo.classList.contains("flying")
  ) {
    const belowIndex = Array.from(todoList.children).indexOf(belowTodo);
    const belowRect = belowTodo.getBoundingClientRect();
    /* belowTodo jumps in place of draggedTodo (which is removed), but holds
       the same position */
    draggedTodo.replaceWith(belowTodo);
    /* draggedTodo is getting back to the list in place of belowTodo */
    if (belowIndex === 0) {
      todoList.prepend(draggedTodo);
    } else {
      todoList.children[belowIndex - 1].after(draggedTodo);
    }

    belowTodo.classList.add("flying");
    Object.assign(belowTodo.style, {
      position: "relative",
      top: `${belowRect.top - belowTodo.getBoundingClientRect().top}px`,
      transition: "0.2s ease-out",
    });
    /* for some reason, requestAnimationFrame() does not work properly here,
       but either of two below works as intended */
    // requestIdleCallback(() => {
    //   if (belowTodo) belowTodo.style.top = "0px";
    //   else console.log("whopsi");
    // });
    setTimeout(() => {
      if (belowTodo) belowTodo.style.top = "0px";
      else console.log("whopsi");
    }, 0);
    belowTodo.addEventListener(
      "transitionend",
      (e) => {
        e.target.removeAttribute("style");
        e.target.classList.remove("flying");
      },
      { once: true }
    );

    /* draggedTodo is still dragged, but effectively from a different place
       now, so the grabCoordinates have to be updated */
    grabCoordinates.x = grabCoordinates.x - draggedRect.x + belowRect.x;
    grabCoordinates.y = grabCoordinates.y - draggedRect.y + belowRect.y;
    draggedRect = belowRect;
  }
  /* moving */
  draggedTodo.style.left = `${event.clientX - grabCoordinates.x}px`;
  draggedTodo.style.top = `${event.clientY - grabCoordinates.y}px`;
}

function stopDrag(event) {
  draggedTodo.classList.remove("grabbed");
  draggedTodo.removeAttribute("style");
  draggedTodo.toolboxActive = false;
  window.removeEventListener("mousemove", dragging);
  draggedTodo = null;
  grabCoordinates = null;
  saveToLocalStorage();
}

function deleteTodo(event) {
  // console.log("delete");
  event.target.remove();
  saveToLocalStorage();
}

/**
 * Saves all the todos to the localStorage
 * using JSON.stringify()
 */
function saveToLocalStorage() {
  const todos = Array.from(todoList.children).map((value) => ({
    task: value.textContent,
    completed: value.completed,
  }));
  localStorage.todos = JSON.stringify(todos);
}
