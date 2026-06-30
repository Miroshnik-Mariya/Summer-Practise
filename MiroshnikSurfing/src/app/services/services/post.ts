import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// import { environment } from './src/app/environment';

export interface Post {
  id: number;
  text?: string;
  photo?: string;
  publishDate: string;
  authorNickname?: string;
  authorName?: string;
  authorSurname?: string;
  authorPhoto?: string;
}

export interface AddPostRequest {
  text?: string;
  photo?: string;
  authorNickname: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = environment.apiUrl || 'http://localhost:5001';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/News`);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/News/${id}`);
  }

  getUserPosts(nickname: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/News/user/${nickname}`);
  }

  createPost(postData: AddPostRequest): Observable<any> {
    const formData = new FormData();
    formData.append('text', postData.text || '');
    formData.append('photo', postData.photo || '');
    formData.append('authorNickname', postData.authorNickname);
    
    return this.http.post(`${this.apiUrl}/News`, formData);
  }

  updatePost(id: number, postData: AddPostRequest): Observable<any> {
    const formData = new FormData();
    formData.append('text', postData.text || '');
    formData.append('photo', postData.photo || '');
    formData.append('authorNickname', postData.authorNickname);
    
    return this.http.put(`${this.apiUrl}/News/${id}`, formData);
  }

  deletePost(id: number, authorNickname: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/News/${id}?authorNickname=${authorNickname}`);
  }
}