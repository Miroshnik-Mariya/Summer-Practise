// services/user.service.ts
import { HttpClient } from "@angular/common/http";
import { EventEmitter, Inject, Injectable, Output } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { tap } from 'rxjs/operators';

export interface UserInfo {
    nickname: string;
    photo: string;
    authData: string;
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

export interface LoginRequest {
    login: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    user: any;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    @Output() authChanged: EventEmitter<any> = new EventEmitter();
    
    private authStatusSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
    public authStatus$ = this.authStatusSubject.asObservable();

    constructor(
        private http: HttpClient,
        @Inject('BASE_API_URL') private baseUrl: string,
        private router: Router
    ) {}

    register(registerData: RegisterRequest): Observable<AuthResponse> {
        console.log('UserService.register called:', registerData);
        
        const formData = new FormData();
        formData.append('nickname', registerData.nickname);
        formData.append('email', registerData.email);
        formData.append('password', registerData.password);
        if (registerData.name) formData.append('name', registerData.name);
        if (registerData.surname) formData.append('surname', registerData.surname);
        if (registerData.contactInfo) formData.append('contactInfo', registerData.contactInfo);
        if (registerData.userInfo) formData.append('userInfo', registerData.userInfo);
        if (registerData.achievement) formData.append('achievement', registerData.achievement);
        if (registerData.image) formData.append('image', registerData.image);

        return this.http.post<AuthResponse>(this.baseUrl + '/Register', formData);
    }

    login(loginData: LoginRequest): Observable<AuthResponse> {
        console.log('UserService.login called:', loginData);
        
        const formData = new FormData();
        formData.append('nickname', loginData.login);
        formData.append('password', loginData.password);
        
        return this.http.post<AuthResponse>(this.baseUrl + '/Login', formData).pipe(
            tap({
                next: (response: any) => {
                    console.log('Login response:', response);
                    
                    // ✅ Бекенд возвращает пользователя напрямую
                    // response - это сам пользователь, а не { user: ... }
                    if (response && response.id && response.nickname) {
                        console.log('User found:', response);
                        
                        const authData = window.btoa(loginData.login + ':' + loginData.password);
                        const userInfo: UserInfo = {
                            nickname: response.nickname,
                            photo: response.image || '',
                            authData: authData
                        };
                        
                        console.log('UserInfo to save:', userInfo);
                        
                        localStorage.setItem('userInfo', JSON.stringify(userInfo));
                        localStorage.setItem('isAuthenticated', 'true');
                        
                        console.log('Data saved to localStorage');
                        console.log('localStorage userInfo:', localStorage.getItem('userInfo'));
                        console.log('localStorage isAuthenticated:', localStorage.getItem('isAuthenticated'));
                        
                        console.log('Updating authStatus to true');
                        this.authStatusSubject.next(true);
                        
                        console.log('Emitting authChanged');
                        this.authChanged.emit();
                    } else {
                        console.log('WARNING: Invalid response structure:', response);
                        console.log('Response keys:', Object.keys(response || {}));
                    }
                },
                error: (error) => {
                    console.log('Login error:', error);
                }
            })
        );
    }

    logout() {
        console.log('UserService.logout called');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('isAuthenticated');
        
        this.authStatusSubject.next(false);
        this.authChanged.emit();
        
        this.router.navigate(['/authorization']);
    }

    isAuthenticated(): boolean {
        const result = localStorage.getItem('isAuthenticated') === 'true';
        return result;
    }

    getUserInfo(): UserInfo | null {
        const userData = localStorage.getItem('userInfo');
        if (userData) {
            try {
                return JSON.parse(userData) as UserInfo;
            } catch {
                return null;
            }
        }
        return null;
    }

    refreshAuthStatus() {
        console.log('refreshAuthStatus called');
        const isAuth = this.isAuthenticated();
        console.log('isAuthenticated:', isAuth);
        
        this.authStatusSubject.next(isAuth);
        
        if (isAuth) {
            console.log('Emitting authChanged event');
            this.authChanged.emit();
        }
        return isAuth;
    }
}