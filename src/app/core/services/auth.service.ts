import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '@etdb/abstractions/api.service';
import { IdentityToken, UserLogin, IdentityUser, RegisterUser } from '@etdb/core/models';
import { environment } from 'environments/environment';

@Injectable()
export class AuthService extends ApiService {
    private headers: HttpHeaders = new HttpHeaders()
        .set('Authorization', 'Basic d2ViLmNsaWVudDpnaXg4ZXhrbmY5c3h2bmh2dmtyZ3R6bTVlYjdvNHU3bWtwbW5xODZtbzkwd2plNDlxdQ==')
        .set('Accept', 'application/json')
        .set('cache-control', 'no-cache');

    public constructor(private http: HttpClient) {
        super();
    }

    public loginViaCredentials(login: UserLogin): Observable<IdentityToken> {
        const formData = new FormData();

        formData.append('grant_type', 'password');
        formData.append('username', login.userName);
        formData.append('password', login.password);
        formData.append('scope', 'UserService FileService IndexService StorageService openid offline_access');

        return this.http.post<IdentityToken>(environment.userserviceAuthUrl, formData, {
            headers: this.headers
        });
    }

    public loginViaRefreshtoken(token: IdentityToken): Observable<IdentityToken> {
        const formData = new FormData();

        formData.append('grant_type', 'refresh_token');
        formData.append('refresh_token', token.refresh_token);

        return this.http.post<IdentityToken>(environment.userserviceAuthUrl, formData, {
            headers: this.headers
        });
    }

    public loadIdentityUser(): Observable<IdentityUser> {
        const headers = this.baseHeaders;

        return this.http.get<IdentityUser>(environment.userserviceAuthProfileUrl, {
            headers: headers
        });
    }

    public register(registerUser: RegisterUser): Observable<any> {
        const headers = this.baseHeaders;
        return this.http.post(environment.userserviceUrl + 'auth/registration',
            JSON.stringify(registerUser), {
                headers: headers
            });
    }
}
