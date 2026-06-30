import { HttpClient } from "@angular/common/http";
import { EventEmitter, Inject, Injectable, Output } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

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
    login: string;      // может быть email или nickname
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
    @Output() errors: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpClient,
        @Inject('BASE_API_URL') private baseUrl: string,
        private router: Router
    ) {}

    // МЕТОД РЕГИСТРАЦИИ
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

    // НОВЫЙ МЕТОД ДЛЯ ВХОДА (по email или nickname)
    login(loginData: LoginRequest): Observable<AuthResponse> {
    console.log('UserService.login called:', loginData);
    
    const formData = new FormData();
    formData.append('nickname', loginData.login);  // ← ДОЛЖНО БЫТЬ 'nickname'!
    formData.append('password', loginData.password);
    
    return this.http.post<AuthResponse>(this.baseUrl + '/Login', formData);
}

    // СТАРЫЙ МЕТОД (оставляем для совместимости)
    nickname(nickname: string, password: string) {
        const formData = new FormData();
        formData.append('nickname', nickname);
        formData.append('password', password);

        this.http.post(this.baseUrl + '/Login', formData).subscribe({
            next: (user: any) => {
                const authData = window.btoa(nickname + ':' + password);
                const userInfo: UserInfo = {
                    nickname: nickname,
                    photo: user.photo,
                    authData: authData
                };
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                localStorage.setItem('isAuthenticated', 'true');

                this.authChanged.emit();
                this.router.navigate(['/feed']);
            },
            error: (e) => {
                this.errors.emit(e);
            }
        });
    }

    logout() {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('isAuthenticated');
        this.authChanged.emit();
        this.router.navigate(['/authorization']);
    }

    isAuthenticated(): boolean {
        return localStorage.getItem('isAuthenticated') === 'true';
    }

    getUserInfo(): UserInfo | null {
        const userData = localStorage.getItem('userInfo');
        if (userData) {
            return JSON.parse(userData) as UserInfo;
        }
        return null;
    }
}