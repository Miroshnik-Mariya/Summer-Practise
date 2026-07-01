import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderSmall } from '../header-small/header-small';
import { PostService } from '../services/services/post';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderSmall],
  templateUrl: './add-post.html',
  styleUrl: './add-post.css',
})
export class AddPost {
  @Output() postCreated = new EventEmitter<void>();
  
  post = {
    content: '',
    image: ''
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private postService: PostService,
    private userService: UserService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Размер файла не должен превышать 5MB';
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Пожалуйста, выберите изображение';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.post.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.post.image = '';
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit() {
    if (!this.post.content.trim()) {
      this.errorMessage = 'Введите текст поста';
      return;
    }

    const userInfo = this.userService.getUserInfo();
    if (!userInfo) {
      this.errorMessage = 'Пожалуйста, войдите в систему';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    let photoBase64 = '';
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        photoBase64 = e.target.result;
        this.sendPost(photoBase64);
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.sendPost('');
    }
  }

  sendPost(photoBase64: string) {
    const userInfo = this.userService.getUserInfo();
    
    this.postService.createPost({
      text: this.post.content,
      photo: photoBase64,
      authorNickname: userInfo?.nickname || ''
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.post.content = '';
        this.post.image = '';
        this.selectedFile = null;
        this.imagePreview = null;
        this.postCreated.emit();
        this.router.navigate(['/feed']);
      },
      error: (error) => {
        console.error('Error creating post:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Ошибка при создании поста';
      }
    });
  }

  goBack() {
    this.router.navigate(['/feed']);
  }
}