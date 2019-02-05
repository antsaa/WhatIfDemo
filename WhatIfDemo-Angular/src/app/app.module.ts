import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { AppConfig } from './app.config';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MonitoringErrorHandler } from './error.handler';

import { AppComponent } from './app.component';
import { QuotesComponent } from './quotes/quotes.component';
import { ClaimsComponent } from './claims/claims.component';
import { MonitoringService } from './monitoring.service';

const appRoutes: Routes = [
    { path: 'quotes', component: QuotesComponent },
    { path: 'claims', component: ClaimsComponent },
    { path: '**', component: QuotesComponent }
];

export function initializeApp(appConfig: AppConfig) {
    return () => appConfig.load();
}

@NgModule({
    declarations: [
        AppComponent,
        QuotesComponent,
        ClaimsComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { enableTracing: true })
    ],
    providers: [
        AppConfig,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [AppConfig], multi: true
        },
        MonitoringService,
        {
            provide: ErrorHandler,
            useClass: MonitoringErrorHandler
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
