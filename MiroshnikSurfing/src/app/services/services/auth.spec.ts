import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nickname: string;
  email: string;
  password: string;
  name?: string;
  surname?: string;
  contactInfo?: string;
  userInfo?: string;
  achievement?: string;
  image?: string;
}

export interface UserResponse {
  id: number;
  nickname: string;
  email: string;
  name?: string;
  surname?: string;
  contactInfo?: string;
  userInfo?: string;
  achievement?: string;
  image?: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: UserResponse;
}

@Injectable({
  providedIn: 'root' // Сервис будет доступен во всем приложении
})
export class AuthService {
  private apiUrl = environment.apiUrl || 'http://localhost:5001';

  constructor(private http: HttpClient) {}

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Login`, loginData);
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Register`, registerData);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): UserResponse | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }
}