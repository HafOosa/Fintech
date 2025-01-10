//app.routes.ts
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
import { UserAnalysisComponent  } from '@components/user-analyse/user-analyse.component';
import { AdminOverviewComponent } from '@components/admin-overview/admin-overview.component';
import { CryptoConverterComponent } from './crypto-converter/crypto-converter.component';


export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/Home', pathMatch: 'full' },
  { path: 'Home', component: HomePageComponent },
  { path: 'creditcard', component: CreditCardComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate : [AuthGuard]},
  { path: 'AdminOverview', component: AdminOverviewComponent},


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
      { path: 'Overview',component:UserAnalysisComponent },
      { path: 'exchange', component: CryptoConverterComponent },
    ],
  },


  // Fallback for logout
  { path: 'logout', redirectTo: '/login', pathMatch: 'full' },

  // Wildcard route (optional)
  { path: '**', redirectTo: '/login' },
];
