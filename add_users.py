from database import add_student, add_admin, show_all_users

def main():
    # Студенты
    add_student("24000231", "Рязанова Анастасия Александровна", "2-ПМИб-1", "razanova150")
    add_student("24000245", "Андрей СТАР", "хихихаха", "truemen")
    add_student("24000789", "Кирилл СТАР", "хихихаха", "truemene")
    
    # Администраторы
    add_admin("admin1", "Букунова Ольга Викторовна", "admin123")
    add_admin("admin2", "Букунов Сергей Витальевич", "admin456")
    add_admin("admin3", "Москоленко Людмила Павловна", "admin789")
    add_admin("admin4", "Семенов Адексей Александрович", "admin159")
    
    print("Тестовые пользователи добавлены!")
    show_all_users()

if __name__ == "__main__":
    main()