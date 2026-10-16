// ============================================================
// render.js — отрисовка HTML из данных
// ============================================================
// Здесь живут функции, которые берут готовые данные (объекты, массивы)
// и превращают их в HTML: заполняют элементы по id, создают строки таблицы,
// рисуют квадратики задач.
//
// ВАЖНО: этот файл НЕ делает запросов к серверу.
// Все запросы — в api.js. Здесь только отображение.
// ============================================================


// ------------------------------------------------------------
// renderStudentList(students, activeId, onSelect)
// ------------------------------------------------------------
// Рисует список учеников в сайдбаре.
//
// Аргументы:
//   students  — массив {user_id, full_name} (из loadStudents)
//   activeId  — id ученика, который должен быть подсвечен (число)
//   onSelect  — функция-колбэк, которая вызывается при клике на ученика.
//               Ей передаётся user_id выбранного ученика.
//               Так render не знает, что делать при клике —
//               он просто сообщает main.js: «пользователь выбрал X».
// ------------------------------------------------------------
function renderStudentList(students, activeId, onSelect) {
  const list = document.getElementById("studentList");

  // Очищаем список перед перерисовкой.
  // Без этого при повторном вызове элементы добавятся к старым.
  list.innerHTML = "";

  students.forEach(function (student) {
    const li = document.createElement("li");
    li.textContent = student.full_name;

    // Подсветка активного ученика
    if (student.user_id === activeId) {
      li.classList.add("active");
    }

    // Клик по ученику — вызываем колбэк и передаём id
    li.addEventListener("click", function () {
      onSelect(student.user_id);
    });

    list.appendChild(li);
  });
}


// ------------------------------------------------------------
// renderStudentData(data)
// ------------------------------------------------------------
// Основная функция: заполняет всю правую часть экрана по данным ученика.
//
// Аргумент data — тот самый JSON из задачи 3.4:
//   {
//     user:     { user_id, full_name, class_id },
//     progress: { tests_completed, tests_total, accuracy_average_percent },
//     tests:    [ { test_id, title, tasks, progress_percent, correct_percent,
//                   time, date_assigned }, ... ]
//   }
// ------------------------------------------------------------
function renderStudentData(data) {

  // ---------- 1. Имя ученика ----------
  document.getElementById("studentName").textContent = data.user.full_name;

  // ---------- 2. Прогресс-бар 1: тесты выполнено ----------
  const completed = data.progress.tests_completed;
  const total     = data.progress.tests_total;

  // Текст "1/2"
  document.getElementById("testsCompleted").textContent = completed + "/" + total;

  // Ширина заливки прогресс-бара — процент завершённых тестов.
  // Если total = 0 (такого не должно быть, но на всякий случай),
  // ставим 0%, чтобы не делить на ноль.
  const testsPercent = total > 0 ? (completed / total) * 100 : 0;
  document.getElementById("testsProgressFill").style.width = testsPercent + "%";

  // ---------- 3. Прогресс-бар 2: средняя активность ----------
  // accuracy_average_percent из JSON — это уже число, например 37.0
  const accuracy = data.progress.accuracy_average_percent;

  // Меняем точку на запятую — по-русски проценты пишут через запятую
  // (на скриншоте "18,2%", а не "18.2%")
  document.getElementById("accuracyAvg").textContent =
    accuracy.toFixed(1).replace(".", ",") + "%";

  // Ширина заливки — та же цифра в процентах
  document.getElementById("accuracyProgressFill").style.width = accuracy + "%";

  // ---------- 4. Таблица тестов ----------
  const tbody = document.getElementById("testsTableBody");
  tbody.innerHTML = ""; // чистим перед перерисовкой

  data.tests.forEach(function (test, index) {
    // index начинается с 0, а нумерация строк на экране — с 1
    const rowNumber = index + 1;

    // Создаём строку таблицы
    const tr = document.createElement("tr");

    // --- Ячейка 1: номер строки ---
    const tdNum = document.createElement("td");
    tdNum.className = "col-num";
    tdNum.textContent = rowNumber;
    tr.appendChild(tdNum);

    // --- Ячейка 2: название теста ---
    const tdTitle = document.createElement("td");
    tdTitle.textContent = test.title;
    tr.appendChild(tdTitle);

    // --- Ячейка 3: квадратики задач ---
    const tdTasks = document.createElement("td");
    const grid = document.createElement("div");
    grid.className = "tasks-grid";

    test.tasks.forEach(function (task) {
      const dot = document.createElement("span");
      dot.className = "task-dot";

      // Выбираем цвет квадратика по значению is_correct
      if (task.is_correct === "TRUE") {
        dot.classList.add("correct");   // зелёный
      } else if (task.is_correct === "FALSE") {
        dot.classList.add("incorrect"); // красный
      } else {
        dot.classList.add("skipped");   // серый (это "?")
      }

      grid.appendChild(dot);
    });

    tdTasks.appendChild(grid);
    tr.appendChild(tdTasks);

    // --- Ячейка 4: прогресс прохождения теста, % ---
    const tdProgress = document.createElement("td");
    tdProgress.className = "percent-cell";
    tdProgress.textContent =
      test.progress_percent.toFixed(1).replace(".", ",") + "%";
    tr.appendChild(tdProgress);

    // --- Ячейка 5: выполнено верно, % ---
    const tdCorrect = document.createElement("td");
    tdCorrect.className = "percent-cell";
    tdCorrect.textContent =
      test.correct_percent.toFixed(1).replace(".", ",") + "%";
    tr.appendChild(tdCorrect);

    // --- Ячейка 6: время выполнения ---
    const tdTime = document.createElement("td");
    tdTime.textContent = test.time;
    tr.appendChild(tdTime);

    // --- Ячейка 7: дата выдачи ---
    const tdDate = document.createElement("td");
    tdDate.textContent = test.date_assigned;
    tr.appendChild(tdDate);

    // Добавляем готовую строку в тело таблицы
    tbody.appendChild(tr);
  });
}