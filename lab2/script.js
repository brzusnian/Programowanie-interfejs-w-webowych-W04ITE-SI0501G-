let lists = {
  "Pilne": [],
  "Mało pilne": [],
  "Na wczoraj": []
};

let currentList = "Pilne";

let trash = [];
let lastDeleted = null;
let deleteIndex = null;

function initLists() {
  const select = document.getElementById("listSelect");
  select.innerHTML = "";

  Object.keys(lists).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.innerText = name;
    select.appendChild(option);
  });

  select.value = currentList;

  select.addEventListener("change", (e) => {
    currentList = e.target.value;
    render();
  });
}

initLists();

function addList() {
  const input = document.getElementById("newListInput");
  const name = input.value.trim();

  if (!name) return;

  if (!lists[name]) {
    lists[name] = [];
  }

  input.value = "";
  initLists();
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (text === "") {
    alert("Zadanie nie może być puste!");
    return;
  }

  lists[currentList].push({
    text,
    done: false,
    date: null
  });

  input.value = "";
  render();
}

function render() {
  const container = document.getElementById("taskContainer");
  container.innerHTML = "";

  Object.keys(lists).forEach(listName => {

    const section = document.createElement("div");

    section.innerHTML = `
      <h2 class="list-header">${listName}</h2>
      <ul id="list-${listName}" class="task-list"></ul>
    `;

    container.appendChild(section);

    const ul = section.querySelector("ul");

    lists[listName].forEach((task, index) => {

      const li = document.createElement("li");

      if (task.done) li.classList.add("done");

      li.innerHTML = `
        <span>
          ${task.text}
          ${task.date ? `<div class="meta">${task.date}</div>` : ""}
        </span>
        <button>X</button>
      `;

      li.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") return;

        task.done = !task.done;
        task.date = task.done ? new Date().toLocaleString() : null;

        render();
      });

      li.querySelector("button").addEventListener("click", () => {
        openModal(listName, index);
      });

      ul.appendChild(li);
    });

    const header = section.querySelector(".list-header");
    const ulEl = section.querySelector("ul");

    header.addEventListener("click", () => {
      ulEl.style.display =
        ulEl.style.display === "none" ? "block" : "none";
    });
  });

  renderTrash();
}

function openModal(listName, index) {
  deleteIndex = { listName, index };

  document.getElementById("modalText").innerText =
    "Czy na pewno chcesz usunąć zadanie o treści: " +
    lists[listName][index].text;

  document.getElementById("modal").classList.remove("hidden");
}

document.getElementById("confirmDelete").addEventListener("click", () => {
  const { listName, index } = deleteIndex;

  const deleted = lists[listName][index];

  trash.push(deleted);
  lastDeleted = { deleted, listName };

  lists[listName].splice(index, 1);

  closeModal();
  render();
});

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "z") {

    if (!lastDeleted) return;

    const { deleted, listName } = lastDeleted;

    lists[listName].push(deleted);

    trash = trash.filter(item => item !== deleted);

    lastDeleted = null;

    render();
  }
});

function renderTrash() {
  const trashList = document.getElementById("trashList");
  trashList.innerHTML = "";

  trash.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item.text;
    trashList.appendChild(li);
  });
}

document.getElementById("searchInput").addEventListener("input", function () {
  const value = this.value.toLowerCase();

  document.querySelectorAll("li").forEach(li => {
    const text = li.innerText.toLowerCase();
    li.style.display = text.includes(value) ? "" : "none";
  });
});
