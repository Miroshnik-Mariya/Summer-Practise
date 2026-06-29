import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface IPost {
  id: number;
  author: string;
  avatar?: string;
  content: string;
  image?: string;
  date: Date;
  likes: number;
  //comments: number;
  isLiked: boolean;
}

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.html',
  styleUrls: ['./post.css']
})
export class Post {
  @Input() post!: IPost;

  toggleLike() {
    this.post.isLiked = !this.post.isLiked;
    this.post.likes += this.post.isLiked ? 1 : -1;
  }

  get formattedDate(): string {
    const now = new Date();
    const diff = now.getTime() - this.post.date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    if (days < 7) return `${days} д назад`;
    return this.post.date.toLocaleDateString('ru-RU');
  }
}