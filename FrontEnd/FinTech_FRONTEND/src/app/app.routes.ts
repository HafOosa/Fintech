import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { DashboardComponent } from './auth/components/dashboard/dashboard.component';
import { TransactionsComponent } from './auth/components/transactions/transactions.component';
import { BlockchainComponent } from './auth/components/blockchain/blockchain.component';
import { ProfileComponent } from './auth/components/profile/profile.component';
import path from 'path';
import { HeaderComponent } from './auth/components/header/header.component';
import { SidebarComponent } from './auth/components/side-bar/side-bar.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path:"login",component: LoginComponent},
  {path:"register",component:SignupComponent},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'blockchain', component: BlockchainComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'logout', redirectTo: '/login', pathMatch: 'full' },
  {path:'header',component: HeaderComponent},
  {path:'sidebar',component: SidebarComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }


];