// news-feed.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderSmall } from '../header-small/header-small';
import { Post, IPost } from '../post/post';
import { AddPost } from "../add-post/add-post";
import { PostService } from '../services/services/post';
import { UserService } from '../services/user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-news-feed',
  standalone: true,
  imports: [CommonModule, RouterModule, Post, AddPost, HttpClientModule, HeaderSmall],
  templateUrl: './news-feed.html',
  styleUrls: ['./news-feed.css']
})
export class NewsFeed implements OnInit {
  posts: IPost[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.isLoading = true;
    this.errorMessage = '';

    this.postService.getPosts().subscribe({
      next: (apiPosts) => {
        console.log('Posts loaded:', apiPosts);
        
        this.posts = apiPosts.map(apiPost => ({
          id: apiPost.id,
          author: apiPost.authorNickname || 'Anonymous',
          avatar: apiPost.authorPhoto || 'https://i.pravatar.cc/150?img=1',
          content: apiPost.text || '',
          image: apiPost.photo || '',
          date: new Date(apiPost.publishDate),
          likes: 0,
          isLiked: false
        }));
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.errorMessage = 'Failed to load posts';
        this.isLoading = false;
        this.loadMockData();
      }
    });
  }

  loadMockData() {
    console.log('Loading mock data...');
    this.posts = [
      {
        id: 1,
        author: 'Михаил М.',
        avatar: 'https://i.pravatar.cc/150?img=11',
        content: 'Поймал идеальную волну сегодня утром на пляже "Золотой берег"! Вода как стекло, солнце только встало — лучший сёрфинг в моей жизни!',
        image: 'https://avatars.mds.yandex.net/i?id=e1be29da2ab451b6ccca21d9fb0d9d34_l-4987522-images-thumbs&n=13',  
        date: new Date(Date.now() - 1000 * 60 * 30),
        likes: 42,
        isLiked: false
      },
      {
        id: 2,
        author: 'Анна С.',
        avatar: 'https://i.pravatar.cc/150?img=5',
        content: 'Моя новая доска уже в деле! Сегодня первый раз попробовала её в деле — ощущения невероятные! Кто ещё занимается сёрфингом? Делитесь опытом!',
        image: 'https://i.pinimg.com/originals/b5/44/92/b54492c49c4420db12872b8dd16749fb.jpg',  
        date: new Date(Date.now() - 1000 * 60 * 60 * 2),
        likes: 28,
        isLiked: true
      }
    ];
  }

  onPostCreated() {
    console.log('New post created, reloading...');
    this.loadPosts();
  }

  goTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}