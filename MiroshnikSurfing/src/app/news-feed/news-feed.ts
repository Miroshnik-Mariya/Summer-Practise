import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderSmall } from '../header-small/header-small';
import { Post, IPost } from '../post/post';
import { AddPost } from "../add-post/add-post";

@Component({
  selector: 'app-news-feed',
  standalone: true,
  imports: [CommonModule, RouterModule, Post, AddPost],
  templateUrl: './news-feed.html',
  styleUrls: ['./news-feed.css']
})
export class NewsFeed implements OnInit {
  posts: IPost[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.posts = [
      {
        id: 1,
        author: 'Михаил М.',
        avatar: 'https://i.pravatar.cc/150?img=11',
        content: '🏄‍♂️ Поймал идеальную волну сегодня утром на пляже "Золотой берег"! Вода как стекло, солнце только встало — лучший сёрфинг в моей жизни! 🌅',
        image: 'https://avatars.mds.yandex.net/i?id=e1be29da2ab451b6ccca21d9fb0d9d34_l-4987522-images-thumbs&n=13',  
        date: new Date(Date.now() - 1000 * 60 * 30),
        likes: 42,
        isLiked: false
      },
      {
        id: 2,
        author: 'Анна С.',
        avatar: 'https://i.pravatar.cc/150?img=5',
        content: '🌊 Моя новая доска уже в деле! Сегодня первый раз попробовала её в деле — ощущения невероятные! 🏄‍♀️ Кто ещё занимается сёрфингом? Делитесь опытом!',
        image: 'https://i.pinimg.com/originals/b5/44/92/b54492c49c4420db12872b8dd16749fb.jpg',  
        date: new Date(Date.now() - 1000 * 60 * 60 * 2),
        likes: 28,
        isLiked: true
      },
      {
        id: 3,
        author: 'Дмитрий П.',
        avatar: 'https://i.pravatar.cc/150?img=12',
        content: 'Подборка лучших мест для сёрфинга в этом сезоне! 1️⃣ Бали — рай для серферов, 2️⃣ Шри-Ланка — волны для всех уровней, 3️⃣ Португалия — европейский сёрфинг на высоте! Где планируете кататься? 🏄‍♂️',
        image: 'https://avatars.mds.yandex.net/i?id=54dec95b73edb74c75142cfd7da16e7e_l-12752514-images-thumbs&n=13',  
        date: new Date(Date.now() - 1000 * 60 * 60 * 5),
        likes: 56,
        isLiked: false
      },
      {
        id: 4,
        author: 'Екатерина К.',
        avatar: 'https://i.pravatar.cc/150?img=9',
        content: 'Вчерашний закат был просто волшебным! Лучший способ закончить день — ловить волны под звуки прибоя. Сёрфинг — это не просто спорт, это образ жизни! ✨',
        image: 'https://i.pinimg.com/736x/99/dd/5e/99dd5ef91eb6a28c25f37081f308fad0.jpg',  
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        likes: 34,
        isLiked: false
      },
      {
        id: 5,
        author: 'Алексей Н.',
        avatar: 'https://i.pravatar.cc/150?img=33',
        content: '🎯 Моя цель на этот год — освоить "бочку"! Каждый день тренируюсь, смотрю видео с профессионалами. Кто уже умеет? Поделитесь советами! 🙏🏄‍♂️',
        image: 'https://i.pinimg.com/736x/2c/88/25/2c88259cdd8053e1ed766392689d2daf.jpg',  
        date: new Date(Date.now() - 1000 * 60 * 60 * 48),
        likes: 19,
        isLiked: false
      },
      {
        id: 6,
        author: 'Марина В.',
        avatar: 'https://i.pravatar.cc/150?img=25',
        content: '🌺 Бали, я люблю тебя! Провела здесь лучший месяц в своей жизни. Волны, солнце, океан — всё, что нужно для счастья! Возвращаюсь через месяц! ✈️🏄‍♀️',
        image: 'https://i.pinimg.com/736x/84/e9/65/84e965aded0a21cb9d35a977bb1584f4.jpg',  
        date: new Date(Date.now() - 1000 * 60 * 60 * 72),
        likes: 47,
        isLiked: false
      }
    ];
  }

  goTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}