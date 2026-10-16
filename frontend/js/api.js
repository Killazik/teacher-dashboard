// ============================================================
// api.js — слой работы с данными
// ============================================================
// Этот файл — единственное место, где фронт «общается» с внешним миром.
// Пока данных нет с бэкенда — функции возвращают моки (MOCK_*).
// Когда ты поднимешь Flask/FastAPI, замени тела функций на fetch-запросы.
// Всё остальное (render.js, main.js) менять не придётся.
// ============================================================


// ------------------------------------------------------------
// МОК 1: список учеников класса
// ------------------------------------------------------------
// Это то, что должен вернуть эндпоинт вида:
//   GET /api/classes/{class_id}/students
//
// Формат ответа — массив объектов с полями user_id и full_name.
// В реальном проекте эти данные придут из user.csv + class_user_link.csv.
// ------------------------------------------------------------
const MOCK_STUDENTS = [
  { user_id: 1,  full_name: "Волкова Влада" },
  { user_id: 2,  full_name: "Волкова Кира" },
  { user_id: 3,  full_name: "Калашникова Арина" },
  { user_id: 4,  full_name: "Кузнецова Мария" },  // активный ученик на макете
  { user_id: 5,  full_name: "Морозова Дарина" },
  { user_id: 6,  full_name: "Морозов Артём" },
  { user_id: 7,  full_name: "Прокофьева Екатерина" },
  { user_id: 8,  full_name: "Соловьёва Виктория" },
  { user_id: 9,  full_name: "Тарасова Александра" },
  { user_id: 10, full_name: "Фёдорова Анастасия" },
];


// ------------------------------------------------------------
// МОК 2: данные конкретного ученика
// ------------------------------------------------------------
// Это ровно тот JSON, который должна вернуть задача 3.4.
// Эндпоинт: GET /api/students/{user_id}/classes/{class_id}
//
// Структура:
//   user      — кто это (id, имя, класс)
//   progress  — сводка (сколько тестов пройдено / всего, средняя точность)
//   tests[]   — массив тестов, от позднего к раннему
//     tasks[] — массив задач внутри теста (order_number, task_id, is_correct)
//
// Здесь я взял пример для user_id=2, class_id=2 из условия задачи 3.4.
// ------------------------------------------------------------
const MOCK_STUDENT_DATA = {
  user: {
    user_id: 2,
    full_name: "Кузнецова Мария",
    class_id: 2
  },
  progress: {
    tests_completed: 1,
    tests_total: 1,
    accuracy_average_percent: 37.0
  },
  tests: [
    {
      test_id: 8,
      title: "ЕГЭ тест 1 вариант 1 2024",
      tasks: [
        { order_number: 1,  task_id: 1,  is_correct: "FALSE" },
        { order_number: 2,  task_id: 2,  is_correct: "FALSE" },
        { order_number: 3,  task_id: 3,  is_correct: "FALSE" },
        { order_number: 4,  task_id: 4,  is_correct: "FALSE" },
        { order_number: 5,  task_id: 5,  is_correct: "FALSE" },
        { order_number: 6,  task_id: 6,  is_correct: "TRUE"  },
        { order_number: 7,  task_id: 7,  is_correct: "FALSE" },
        { order_number: 8,  task_id: 8,  is_correct: "FALSE" },
        { order_number: 9,  task_id: 9,  is_correct: "FALSE" },
        { order_number: 10, task_id: 10, is_correct: "TRUE"  },
        { order_number: 11, task_id: 11, is_correct: "FALSE" },
        { order_number: 12, task_id: 12, is_correct: "FALSE" },
        { order_number: 13, task_id: 13, is_correct: "TRUE"  },
        { order_number: 14, task_id: 14, is_correct: "FALSE" },
        { order_number: 15, task_id: 15, is_correct: "FALSE" },
        { order_number: 16, task_id: 16, is_correct: "FALSE" },
        { order_number: 17, task_id: 17, is_correct: "TRUE"  },
        { order_number: 18, task_id: 18, is_correct: "FALSE" },
        { order_number: 19, task_id: 19, is_correct: "TRUE"  },
        { order_number: 20, task_id: 20, is_correct: "TRUE"  },
        { order_number: 21, task_id: 21, is_correct: "FALSE" },
        { order_number: 22, task_id: 22, is_correct: "TRUE"  },
        { order_number: 23, task_id: 23, is_correct: "TRUE"  },
        { order_number: 24, task_id: 24, is_correct: "FALSE" },
        { order_number: 25, task_id: 25, is_correct: "TRUE"  },
        { order_number: 26, task_id: 26, is_correct: "FALSE" },
        { order_number: 27, task_id: 27, is_correct: "TRUE"  }
      ],
      progress_percent: 100.0,
      correct_percent: 37.0,
      time: "03:46:17",
      date_assigned: "05.03.24"
    }
  ]
};


// ============================================================
// ПУБЛИЧНЫЕ ФУНКЦИИ
// ============================================================
// Их будут вызывать из main.js. Обе объявлены как async —
// это значит, что внутри можно использовать await, и что
// при вызове нужно писать `await loadStudents(...)`.
// Когда добавим fetch, асинхронность уже будет на месте.
// ============================================================


// ------------------------------------------------------------
// loadStudents(classId)
// ------------------------------------------------------------
// Возвращает список учеников указанного класса.
//
// Аргумент:
//   classId — id класса (число), например 2
//
// Возвращает:
//   Promise<Array<{user_id, full_name}>>
// ------------------------------------------------------------
async function loadStudents(classId) {
  // --- ВАРИАНТ С БЭКЕНДОМ (раскомментируй, когда Flask будет готов) ---
  // const response = await fetch(`/api/classes/${classId}/students`);
  // if (!response.ok) {
  //   throw new Error(`Не удалось загрузить учеников: ${response.status}`);
  // }
  // return await response.json();

  // --- ВАРИАНТ С МОКОМ (сейчас) ---
  return MOCK_STUDENTS;
}


// ------------------------------------------------------------
// loadStudentData(userId, classId)
// ------------------------------------------------------------
// Возвращает полный JSON по конкретному ученику — тот самый,
// который собирается в задаче 3.4.
//
// Аргументы:
//   userId  — id ученика (число)
//   classId — id класса (число)
//
// Возвращает:
//   Promise<{user, progress, tests}>
// ------------------------------------------------------------
async function loadStudentData(userId, classId) {
  // --- ВАРИАНТ С БЭКЕНДОМ (раскомментируй, когда Flask будет готов) ---
  // const response = await fetch(`/api/students/${userId}/classes/${classId}`);
  // if (!response.ok) {
  //   throw new Error(`Не удалось загрузить данные ученика: ${response.status}`);
  // }
  // return await response.json();

  // --- ВАРИАНТ С МОКОМ (сейчас) ---
  return MOCK_STUDENT_DATA;
}