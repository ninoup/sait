from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

engine = create_engine('sqlite:///./university.db', connect_args={"check_same_thread": False})
Base = declarative_base() 

class Student(Base):
    __tablename__ = 'students'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    full_name = Column(String(100))
    group = Column(String(100))
    password_hash = Column(String(100))
    
    def set_password(self, password):
        self.password_hash = pwd_context.hash(password)
    
    def check_password(self, password):
        return pwd_context.verify(password, self.password_hash)

class Admin(Base):
    __tablename__ = 'admins'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    full_name = Column(String(100))
    password_hash = Column(String(100))
    
    def set_password(self, password):
        self.password_hash = pwd_context.hash(password)
    
    def check_password(self, password):
        return pwd_context.verify(password, self.password_hash)

# Создаем таблицы
Base.metadata.create_all(bind=engine)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()

def add_student(username, full_name, group, password=None):
    session = Session()  
    try:
        new_student = Student(username=username, full_name=full_name, group=group)
        if password:
            new_student.set_password(password)
        session.add(new_student)
        session.commit()
        print(f"Студент {full_name} успешно добавлен!")
    except Exception as e:
        session.rollback()
        print(f"Ошибка добавления студента: {str(e)}")
    finally:
        session.close()

def add_admin(username, full_name, password):
    session = Session()
    try:
        new_admin = Admin(username=username, full_name=full_name)
        new_admin.set_password(password)
        session.add(new_admin)
        session.commit()
        print(f"Администратор {full_name} успешно добавлен!")
    except Exception as e:
        session.rollback()
        print(f"Ошибка добавления администратора: {str(e)}")
    finally:
        session.close()

def show_all_users():
    session = Session()
    try:
        print("\nСтуденты:")
        students = session.query(Student).all()
        for student in students:
            print(f"  ID: {student.id}, Логин: {student.username}, ФИО: {student.full_name}, группа: {student.group}")
        
        print("\nАдминистраторы:")
        admins = session.query(Admin).all()
        for admin in admins:
            print(f"  ID: {admin.id}, Логин: {admin.username}, ФИО: {admin.full_name}")
    finally:
        session.close()

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Database schema updated successfully!")