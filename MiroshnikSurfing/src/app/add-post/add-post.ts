import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderSmall } from '../header-small/header-small';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderSmall],
  templateUrl: './add-post.html',
  styleUrl: './add-post.css',
})
export class AddPost {
  post = {
    content: '',
    image: ''
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private router: Router) {}

  // Выбор файла
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Проверка размера (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Размер файла не должен превышать 5MB';
        return;
      }

      // Проверка типа
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Пожалуйста, выберите изображение';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';

      // Превью изображения
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.post.image = e.target.result; // Сохраняем как base64
      };
      reader.readAsDataURL(file);
    }
  }

  // Удалить изображение
  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.post.image = '';
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Отправка поста
  onSubmit() {
    if (!this.post.content.trim()) {
      this.errorMessage = 'Введите текст поста';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Имитация отправки поста
    setTimeout(() => {
      this.isLoading = false;
      console.log('Пост создан:', {
        content: this.post.content,
        image: this.post.image,
        file: this.selectedFile
      });
      // Возвращаемся на ленту
      this.router.navigate(['/feed']);
    }, 1500);
  }

  // Отмена
  goBack() {
    this.router.navigate(['/feed']);
  }
}