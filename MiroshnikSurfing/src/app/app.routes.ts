import { Routes } from '@angular/router';
import { NewsFeed } from './news-feed/news-feed';
import { Registration } from './registration/registration';
import { ResetPAssword } from './reset-password/reset-password';
import { Authorization } from './authorization/authorization';

export const routes: Routes = [
    {path: '', component: NewsFeed}, //ЛЕНТА НОВОСТЕЙ 
    {path: 'registration', component: Registration},//РЕГИСТРАЦИЯ
    {path: 'authorization', component: Authorization}, //АВТОРИЗАЦИЯ 
    {path: 'reset-password', component: ResetPAssword },  //СБРОС ПАРОЛЯ 
];
