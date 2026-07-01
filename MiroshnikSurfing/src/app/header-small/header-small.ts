import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-small',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header-small.html',
  styleUrl: './header-small.css',
})
export class HeaderSmall implements OnInit, OnDestroy {
  isAuthenticated = false;
  userNickname = '';
  userPhoto = 'assets/default-avatar.png';
  private authSubscription: Subscription | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('HeaderSmall: ngOnInit');
    
    // ✅ Подписываемся на BehaviorSubject
    this.authSubscription = this.userService.authStatus$.subscribe((status) => {
      console.log('HeaderSmall: authStatus changed to', status);
      this.updateUserStatus();
    });
    
    // Первоначальное обновление
    this.updateUserStatus();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
      console.log('HeaderSmall: unsubscribed');
    }
  }

  updateUserStatus() {
    console.log('HeaderSmall: updateUserStatus called');
    this.isAuthenticated = this.userService.isAuthenticated();
    console.log('HeaderSmall: isAuthenticated =', this.isAuthenticated);
    
    if (this.isAuthenticated) {
      const userInfo = this.userService.getUserInfo();
      console.log('HeaderSmall: userInfo =', userInfo);
      if (userInfo) {
        this.userNickname = userInfo.nickname || '';
        this.userPhoto = userInfo.photo || 'assets/default-avatar.png';
      }
    } else {
      this.userNickname = '';
      this.userPhoto = 'assets/default-avatar.png';
    }
  }

  logout() {
    console.log('HeaderSmall: logout called');
    this.userService.logout();
    this.router.navigate(['/authorization']);
  }
}