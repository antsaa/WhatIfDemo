import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../auth.service';
import { ProgressService } from '../progress.service';
import { AppConfig } from '../app.config';

@Component({
    selector: 'app-quotes',
    templateUrl: './quotes.component.html',
    styleUrls: ['./quotes.component.css']
})
export class QuotesComponent {
    protected config = AppConfig.settings;
    quotes = null;

    constructor(private authService: AuthService,
        private progressService: ProgressService,
        private http: HttpClient)
    {
        this.reloadQuotes();
    }
    
    // Loads the latest quotes from server
    reloadQuotes() {
        this.http.get(this.config.api.url + '/api/GetQuotes', this.authService.backendHttpOptions)
            .subscribe(this.progressService.getObserver(null, (response: any) => {
                this.quotes = response;
            }));
    }

    // Purchases the selected policy and reloads the list
    buyPolicy(policy: any) {

        this.http.post(this.config.api.url + '/api/Purchase', policy, this.authService.backendHttpOptions)
            .subscribe(this.progressService.getObserver(null, () => {

                alert('Thank you for purchasing ' + policy.title + '! You will be charged daily!');
            }));
    }
}