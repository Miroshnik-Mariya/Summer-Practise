import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HeaderSmall } from '../header-small/header-small';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-component',
  imports: [FormsModule, CommonModule, HeaderSmall, RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {
  // Модель пользователя
  user = {
    nickname: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    contacts: '',
    aboutMyself: '',
    achievements: '',
    photo: ''
  };

  // поле для повторного ввода пароля
  repeatedPassword: string = '';  // <-- Этого не хватало!

  // UI состояния
  showPassword = false;
  isSubmitted = false;
  isLoading = false;

  @ViewChild('registerForm') registerForm!: NgForm;

  // --- Геттеры для валидации ---
  get isNicknameValid(): boolean {
    const len = this.user.nickname.length;
    return len >= 3 && len <= 20;
  }

  get isEmailValid(): boolean {
    return this.user.email.includes('@') && this.user.email.length <= 31;
  }

  get isPasswordValid(): boolean {
    const pass = this.user.password;
    const regex = /^[\w+]+$/;
    return pass.length >= 6 && pass.length <= 20 && regex.test(pass);
  }

  get isFirstnameValid(): boolean {
    return this.user.firstname.length <= 31;
  }

  get isLastnameValid(): boolean {
    return this.user.lastname.length <= 31;
  }

  get isContactsValid(): boolean {
    return this.user.contacts.length <= 255;
  }

  get isAboutMyselfValid(): boolean {
    return this.user.aboutMyself.length <= 255;
  }

  get isAchievementsValid(): boolean {
    return this.user.achievements.length <= 255;
  }

  // Проверка совпадения паролей
  get passwordsMatch(): boolean {
    return this.user.password === this.repeatedPassword;
  }

  // --- Методы ---
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.user.photo = e.target.result; // Сохраняем как base64
    };
    reader.readAsDataURL(file);
  }
}

  onSubmit() {
    this.isSubmitted = true;
    
    if (this.registerForm?.invalid || !this.passwordsMatch) {
      // Прокручиваем к первому полю с ошибкой
      const firstInvalid = document.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Если все ок - отправляем
    this.isLoading = true;
    console.log('Регистрация:', this.user);
    
    // Симуляция отправки
    setTimeout(() => {
      this.isLoading = false;
      // Здесь редирект или сообщение об успехе
    }, 2000);
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm?.controls?.[fieldName];
    return this.isSubmitted && !!control && control.invalid;
  }

  getFieldError(fieldName: string): string {
    const control = this.registerForm?.controls?.[fieldName];
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return 'Поле обязательно для заполнения';
    if (errors['minlength']) return `Минимум ${errors['minlength'].requiredLength} символов`;
    if (errors['maxlength']) return `Максимум ${errors['maxlength'].requiredLength} символов`;
    if (errors['pattern']) return 'Недопустимые символы';
    if (errors['email']) return 'Введите корректный email';
    return 'Неверное значение';
  }

  shouldShowError(fieldName: string): boolean {
    const control = this.registerForm?.controls?.[fieldName];
    return this.isSubmitted && !!control && control.invalid;
  }
}