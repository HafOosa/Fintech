import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CryptoIconsComponent } from '@auth/components/crypto-icons/crypto-icons.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Add this interface before the component
interface InfoDataType {
  [key: string]: {
    title: string;
    content: string;
  };
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    CryptoIconsComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  currentYear = new Date().getFullYear();
  isDarkTheme = false; // State for theme toggle
  selectedInfo: { title: string; content: string } | null = null;

  features = [
    {
      icon: 'account_balance_wallet',
      title: 'Double Portefeuille',
      description: 'Gérez votre argent traditionnel et vos cryptomonnaies dans une seule application',
    },
    {
      icon: 'currency_bitcoin',
      title: 'Trading Crypto',
      description: 'Échangez facilement vos cryptomonnaies avec des frais minimaux',
    },
    {
      icon: 'security',
      title: 'Sécurité Maximale',
      description: 'Vos actifs sont protégés par les meilleurs standards de sécurité',
    },
  ];

  footerSections = [
    {
      title: 'À propos',
      links: [
        { text: 'Notre mission', url: '#' },
        { text: "L'équipe", url: '#' },
        { text: 'Carrières', url: '#' },
      ],
    },
    {
      title: 'Produits',
      links: [
        { text: 'Portefeuille', url: '#' },
        { text: 'Exchange', url: '#' },
        { text: 'Cartes', url: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: "Centre d'aide", url: '#' },
        { text: 'Contact', url: '#' },
        { text: 'FAQ', url: '#' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { text: 'Confidentialité', url: '#' },
        { text: 'Conditions', url: '#' },
        { text: 'Licences', url: '#' },
      ],
    },
  ];

  // Add type annotation here
  infoData: InfoDataType = {
    'Notre mission': {
      title: 'Notre Mission',
      content: 'Nous nous efforçons de fournir une solution complète pour gérer vos finances.',
    },
    "L'équipe": {
      title: "L'Équipe",
      content: "Notre équipe est composée d'experts passionnés par les fintechs.",
    },
    Carrières: {
      title: 'Carrières',
      content: 'Rejoignez notre équipe et construisez le futur des fintechs avec nous.',
    },
    Portefeuille: {
      title: 'Portefeuille',
      content: 'Gérez votre argent et vos cryptomonnaies dans un portefeuille sécurisé.',
    },
    Exchange: {
      title: 'Exchange',
      content: 'Échangez facilement des cryptomonnaies avec des frais réduits.',
    },
    Cartes: {
      title: 'Cartes',
      content: 'Commandez des cartes pour des paiements en cryptomonnaies et en devises.',
    },
    "Centre d'aide": {
      title: "Centre d'Aide",
      content: "Consultez notre centre d'aide pour résoudre vos problèmes rapidement.",
    },
    Contact: {
      title: 'Contact',
      content: "Contactez-nous via notre formulaire ou notre email support@bancati.com.",
    },
    FAQ: {
      title: 'FAQ',
      content: 'Consultez les questions fréquemment posées par nos utilisateurs.',
    },
    Confidentialité: {
      title: 'Confidentialité',
      content: 'Nous respectons votre vie privée et protégeons vos données.',
    },
    Conditions: {
      title: 'Conditions',
      content: 'Lisez nos conditions générales pour en savoir plus.',
    },
    Licences: {
      title: 'Licences',
      content: 'Découvrez les licences utilisées dans notre application.',
    },
  };

  ngOnInit(): void {
    this.createMarketShareChart();
    this.createBitcoinDominanceChart();
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }

  showInfo(linkText: string): void {
    console.log('Link clicked:', linkText); // Debugging log
    console.log('Available infoData keys:', Object.keys(this.infoData)); // Debugging log

    if (this.infoData[linkText]) {
      this.selectedInfo = this.infoData[linkText];
    } else {
      console.warn(`No data found for link: ${linkText}`);
      this.selectedInfo = {
        title: 'Information Indisponible',
        content: "Nous n'avons pas trouvé les informations liées à ce lien.",
      };
    }
  }

  closeInfo(): void {
    this.selectedInfo = null;
  }

  createMarketShareChart(): void {
    const cachedData = localStorage.getItem('marketShareData');
    const cachedTimestamp = localStorage.getItem('marketShareTimestamp');
    const cacheDuration = 60 * 60 * 1000; // Cache duration: 1 hour

    if (cachedData && cachedTimestamp && Date.now() - parseInt(cachedTimestamp) < cacheDuration) {
      // Use cached data
      this.renderMarketShareChart(JSON.parse(cachedData));
    } else {
      // Fetch new data
      fetch('https://api.coingecko.com/api/v3/global')
        .then((response) => response.json())
        .then((data) => {
          const marketCapPercentage = data.data.market_cap_percentage;

          const chartData = {
            btc: marketCapPercentage.btc,
            eth: marketCapPercentage.eth,
            others: 100 - marketCapPercentage.btc - marketCapPercentage.eth,
          };

          // Cache the data
          localStorage.setItem('marketShareData', JSON.stringify(chartData));
          localStorage.setItem('marketShareTimestamp', Date.now().toString());

          this.renderMarketShareChart(chartData);
        })
        .catch((error) => {
          console.error('Error fetching Market Share data:', error);
          if (cachedData) {
            // Fallback to cached data
            this.renderMarketShareChart(JSON.parse(cachedData));
          }
        });
    }
  }

  renderMarketShareChart(chartData: { btc: number; eth: number; others: number }): void {
    const ctx = document.getElementById('cryptoMarketShare') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element for Market Share Chart not found.');
      return;
    }

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Bitcoin', 'Ethereum', 'Others'],
        datasets: [
          {
            data: [chartData.btc, chartData.eth, chartData.others],
            backgroundColor: ['#f7931a', '#3c3c3d', '#cccccc'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#ffffff' },
          },
        },
      },
    });
  }

  createBitcoinDominanceChart(): void {
    const cachedData = localStorage.getItem('bitcoinDominanceData');
    const cachedTimestamp = localStorage.getItem('bitcoinDominanceTimestamp');
    const cacheDuration = 60 * 60 * 1000; // Cache duration: 1 hour

    if (cachedData && cachedTimestamp && Date.now() - parseInt(cachedTimestamp) < cacheDuration) {
      // Use cached data
      this.renderBitcoinDominanceChart(JSON.parse(cachedData));
    } else {
      // Fetch new data
      fetch('https://api.coingecko.com/api/v3/global')
        .then((response) => response.json())
        .then((data) => {
          const marketCapPercentage = data.data.market_cap_percentage;

          const chartData = {
            btc: marketCapPercentage.btc,
            eth: marketCapPercentage.eth,
            xrp: marketCapPercentage.xrp,
            usdt: marketCapPercentage.usdt,
            bnb: marketCapPercentage.bnb,
          };

          // Cache the data
          localStorage.setItem('bitcoinDominanceData', JSON.stringify(chartData));
          localStorage.setItem('bitcoinDominanceTimestamp', Date.now().toString());

          this.renderBitcoinDominanceChart(chartData);
        })
        .catch((error) => {
          console.error('Error fetching Bitcoin Dominance data:', error);
          if (cachedData) {
            // Fallback to cached data
            this.renderBitcoinDominanceChart(JSON.parse(cachedData));
          }
        });
    }
  }

  renderBitcoinDominanceChart(chartData: { btc: number; eth: number; xrp: number; usdt: number; bnb: number }): void {
    const ctx = document.getElementById('bitcoinDominance') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element for Bitcoin Dominance Chart not found.');
      return;
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Bitcoin', 'Ethereum', 'XRP', 'USDT', 'BNB'],
        datasets: [
          {
            label: 'Market Cap Dominance (%)',
            data: [chartData.btc, chartData.eth, chartData.xrp, chartData.usdt, chartData.bnb],
            borderColor: '#f7931a',
            backgroundColor: 'rgba(247, 147, 26, 0.2)',
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#ffffff',
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#ffffff',
            },
            title: {
              display: true,
              text: 'Cryptocurrencies',
              color: '#ffffff',
            },
          },
          y: {
            ticks: {
              color: '#ffffff',
            },
            title: {
              display: true,
              text: 'Dominance (%)',
              color: '#ffffff',
            },
            min: 0,
            max: 60,
          },
        },
      },
    });
  }
}