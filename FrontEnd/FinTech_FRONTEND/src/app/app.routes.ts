import { NewsComponent } from '@components/news/news.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { BlockchainComponent } from './auth/components/blockchain/blockchain.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { LayoutComponent } from './components/layout/layout.component'; // New layout component
import { SettingsComponent } from './components/settings/settings.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { AdminDashboardComponent } from '@components/admin/admin-dashboard.component';
import { HomePageComponent } from '@components/Home/home-page/home-page.component';
import { CreditCardComponent } from '@components/creditcard/creditcard.component';
import { CryptoCardComponent } from '@components/crypto-card/crypto-card.component';
import { CryptoChartComponent } from '@components/crypto-chart/crypto-chart.component';
import { LatestActivitiesComponent } from '@components/latest-activities/latest-activities.component';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/Home', pathMatch: 'full' },
  { path: 'Home', component: HomePageComponent },
  { path: 'creditcard', component: CreditCardComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'Page1', component: CryptoCardComponent },
  { path: 'Page2', component: CryptoChartComponent },
  { path: 'Page3', component: NewsComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate : [AuthGuard]},
  

  // Authenticated routes (inside the layout)
  {
    path: ':userId',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'wallet', component: WalletComponent },
      { path: 'blockchain', component: BlockchainComponent },
      { path: 'settings',component:SettingsComponent },
    ],
  },

  // Fallback for logout
  { path: 'logout', redirectTo: '/login', pathMatch: 'full' },

  // Wildcard route (optional)
  { path: '**', redirectTo: '/login' },
];
