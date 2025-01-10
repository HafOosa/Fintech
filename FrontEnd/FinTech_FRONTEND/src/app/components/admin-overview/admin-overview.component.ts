import { Component, OnInit } from '@angular/core';
import { AdminOverviewService } from '../../services/admin-overview.service';
import { Chart } from 'chart.js/auto';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.scss'],
  imports: [DecimalPipe, NgFor, NgIf],
})
export class AdminOverviewComponent implements OnInit {
  adminData: any = null;
  error: string | null = null;

  constructor(private adminService: AdminOverviewService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.adminService.getAdminStatistics(token).subscribe(
        (data) => {
          this.adminData = data;
          console.log('Données reçues pour les graphiques :', this.adminData);
          this.initUserRolesChart();
          this.initMonthlyTransactionsChart();
        },
        (error) => {
          this.error = 'Erreur lors de la récupération des données';
          console.error(error);
        }
      );
    } else {
      this.error = 'Token non disponible';
    }
  }

  initUserRolesChart(): void {
    const ctx = document.getElementById('userRolesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Admins', 'Users'], // Rôles
        datasets: [
          {
            data: [
              this.adminData.user_roles.admins,
              this.adminData.user_roles.users,
            ],
            backgroundColor: ['#FF9800', '#757575'], 
            borderColor: ['#f44336', '#4caf50#FF9800', '#757575'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: '#ffffff', // Blanc pour le texte
            },
          },
        },
      },
    });
  }
  initMonthlyTransactionsChart(): void {
    const ctx = document.getElementById('monthlyTransactionsChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.adminData.monthly_transactions.labels, // Mois
        datasets: [
          {
            label: 'Transaction Volume ($)',
            data: this.adminData.monthly_transactions.data, // Montants
            backgroundColor: '#FF9800', // arange
            borderColor: '#FF9800',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff', // Blanc pour le texte
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#ffffff', // Blanc pour les labels de l'axe x
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#ffffff', // Blanc pour les labels de l'axe y
            },
          },
        },
      },
    });
  }
}

