import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/interceptors/auth.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Importez vos routes
import { importProvidersFrom } from '@angular/core';
import { CryptoConverterComponent } from './app/crypto-converter/crypto-converter.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(
      withInterceptors([AuthInterceptor]) // Ajoutez l'intercepteur HTTP ici
    )
  ]
}).catch(err => console.error(err));
