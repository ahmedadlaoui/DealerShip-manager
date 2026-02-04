import { Routes } from '@angular/router';
import { Cars } from './cars/cars';
import { CarDetail } from './car-detail/car-detail';
import { Login } from './login/login';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [

    {
        path: 'login',
        component: Login
    },
    {
        path: 'cars',
        component: Cars
    },
    {
        path: 'cars/:id',
        component: CarDetail
    },
    {
        path: '',
        redirectTo: 'cars',
        pathMatch: 'full'
    }

];
