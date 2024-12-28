import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { BlockchainComponent } from './auth/components/blockchain/blockchain.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { LayoutComponent } from './components/layout/layout.component'; // New layout component

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },

  // Authenticated routes (inside the layout)
  {
    path: '',
    component: LayoutComponent, // Use LayoutComponent as the parent container
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'blockchain', component: BlockchainComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'wallet', component: WalletComponent },
    ],
  },

  // Fallback for logout
  { path: 'logout', redirectTo: '/login', pathMatch: 'full' },

  // Wildcard route (optional)
  { path: '**', redirectTo: '/login' },
];
