import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { AuthService } from './auth.service';
import { ProgressService } from './progress.service';
import { AppConfig } from './app.config';
import { config } from 'rxjs';

// Change Facebook AppId and other settings inside ../environments/environment.ts file
//import { environment } from '../environments/environment';

// Facebook JavaScript SDK's URI
const facebookScriptBaseUri = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=';

// using Facebook JavaScript SDK as JavaScript (since wasn't able to find suitable typings for it)
declare var FB: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    protected config = AppConfig.settings;
    constructor(public authService: AuthService,
        public progressService: ProgressService,
        private changeDetectorRef: ChangeDetectorRef)
    { }

    ngOnInit() {

        // Checking whether config values are correctly specified in environment.ts
        this.checkEnvironmentConfig();

		const facebookScriptTagId = 'facebook-jssdk';
        if (document.getElementById(facebookScriptTagId)) return;
        
		var facebookScriptTag = document.createElement('script');
		facebookScriptTag.id = facebookScriptTagId;
        facebookScriptTag.src = facebookScriptBaseUri + this.config.facebook.appId;

		var allScriptTags = document.getElementsByTagName('script');
		allScriptTags[0].parentNode.insertBefore(facebookScriptTag, allScriptTags[0]);

		// handling the Facebook login event with an instance method
		var onFacebookLoginCallback = (fbResponse) => {
			if (fbResponse.status === 'connected') {
				this.onFacebookLogin(fbResponse.authResponse);
			}
		}

		// asynchronously subscribing to 'auth.statusChange' event
		setTimeout(function () {
			FB.Event.subscribe('auth.statusChange', onFacebookLoginCallback);
		}, 1000);
	}

	// this happens when the user successfully logs in with their Facebook account
    onFacebookLogin(authResponse) {
        
        this.authService.login(authResponse.accessToken)
            .subscribe(this.progressService.getObserver(this.changeDetectorRef));
    }

    checkEnvironmentConfig() {
        if (!this.config.facebook.appId) {
            this.config.facebook.appId = prompt('facebookAppId wasn\'t found in environment.ts file. Enter your facebookAppId (you can register your app on https://developers.facebook.com/apps):');
        }
        if (!this.config.api.url) {
            this.config.api.url = prompt('backendBaseUri wasn\'t found in environment.ts file. Enter the base URI of your Azure Functions deployment:');
        }
    }
}