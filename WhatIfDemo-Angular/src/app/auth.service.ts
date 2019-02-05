import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppConfig } from './app.config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    protected config = AppConfig.settings;
    // Detects whether the user has logged in
    get isLoggedIn(): boolean{
        return this.userId !== null;
    }

    // Here the user's id will be stored after a successful login.
    userId: string = null;
    // These are HttpOptions to be used for communicating with Azure Functions backend. Will contain the session token, after a successful login.
    backendHttpOptions = null;

    constructor(private http: HttpClient) { 
    }

    // Turns Facebook's access token into Azure Functions session token
    login(accessToken: string): Observable<any> {

        var tokenValidationBody = {
            access_token: accessToken
        };

        return this.http.post(this.config.api.url + '/.auth/login/facebook', tokenValidationBody).pipe(
            tap((validationResponse: any) => {
                
                this.userId = validationResponse.user.userId;

                // storing session token in a class field
                this.backendHttpOptions = {
                    headers: new HttpHeaders({ 'X-ZUMO-AUTH': validationResponse.authenticationToken })
                };
            })
        );
    }

    // Gets SAS tokens for each file to be uploaded to Azure Blob. Each token fits the corresponding file and doesn't fit any other name.
    getBlobCredentialsForUpload(fileNames: string[]): Observable<any> {
        return this.http.post(this.config.api + '/api/GetBlobSasTokens', fileNames, this.backendHttpOptions);
    }
}