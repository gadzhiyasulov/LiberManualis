const form = document.getElementById("ruleForm");
const input = document.getElementById("ruleInput");
const list = document.getElementById("ruleList");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const stats = document.getElementById("stats");

const dueDateInput = document.getElementById("dueDateInput");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const activeCount = document.getElementById("activeCount");

let rules = loadRules();

renderAll();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = input.value.trim();
  const dueDate = dueDateInput.value;

  if (text === "") return;

  const newRule = {
    id: Date.now(),
    text: text,
    completed: false,
    dueDate: dueDate
  };

  console.log(newRule);

  rules.push(newRule);
  saveRules();
  renderAll();

  input.value = "";
  dueDateInput.value = "";
});

searchInput.addEventListener("input", function () {
  renderAll();
});

filterSelect.addEventListener("change", function () {
  renderAll();
});

function renderAll() {
  list.innerHTML = "";

  const searchValue = searchInput.value.toLowerCase().trim();
  const filterValue = filterSelect.value;

  const filteredRules = rules.filter(function (rule) {
    const matchesSearch = rule.text.toLowerCase().includes(searchValue);

    if (filterValue === "completed") {
      return matchesSearch && rule.completed === true;
    }

    if (filterValue === "active") {
      return matchesSearch && rule.completed === false;
    }

    return matchesSearch;
  });

  if (filteredRules.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty";
    emptyItem.textContent = "Пока ничего не найдено";
    list.appendChild(emptyItem);
  } else {
    filteredRules.forEach(function (rule) {
      renderRule(rule);
    });
  }

  updateStats();
}

function renderRule(rule) {
  const li = document.createElement("li");
  li.className = "rule-item";

  if (rule.completed) {
    li.classList.add("completed");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = rule.completed;

  const span = document.createElement("span");
  span.className = "rule-text";
  span.textContent = rule.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Удалить";

  checkbox.addEventListener("change", function () {
    rule.completed = checkbox.checked;
    saveRules();
    renderAll();
  });

  deleteBtn.addEventListener("click", function () {
    rules = rules.filter(function (item) {
      return item.id !== rule.id;
    });

    saveRules();
    renderAll();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  list.appendChild(li);
}

function updateStats() {
  const total = rules.length;

  const completed = rules.filter(function (rule) {
    return rule.completed === true;
  }).length;

  const active = total - completed;

  stats.textContent = `Выполнено: ${completed} из ${total}`;
  totalCount.textContent = total;
  completedCount.textContent = completed;
  activeCount.textContent = active;
}

function saveRules() {
  localStorage.setItem("rules", JSON.stringify(rules));
}

function loadRules() {
  const savedRules = localStorage.getItem("rules");

  if (savedRules) {
    return JSON.parse(savedRules);
  }

  return [];
}