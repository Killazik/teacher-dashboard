import csv


# Все наши файлы
files = {
    'user': 'data/user.csv',
    'class': 'data/class.csv',
    'class_user': 'data/class_user_link.csv',
    'task': 'data/task.csv',
    'test': 'data/test.csv',
    'test_task': 'data/test_task_link.csv',
    'test_class': 'data/test_class_user_link.csv',
    'test_attempt': 'data/test_attempt.csv',
    'task_attempt': 'data/task_attempt.csv'
}

# Список для результата
result = []

# Читание файлов
for key, filename in files.items():
    with open(filename, encoding='UTF-8') as file_in:
        # Читаем строки в каждом файле
        reader = csv.reader(file_in)
        # Пропуск заголовка
        next(reader)
        # Считаем сколько строк
        count = len(list(reader))
    
    # Добавить count в result
    result.append(count)
    
# Распаковка списка и вывод результата
print(*result)