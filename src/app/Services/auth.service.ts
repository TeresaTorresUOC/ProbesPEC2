import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDTO } from '../Models/auth.dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


interface AuthToken {
  user_id: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'users';
    const baseUrl = environment.apiUrl.replace(/\/$/, '');
    this.urlBlogUocApi = `${baseUrl}/${this.controller}`;
  }

  login(auth: AuthDTO): Observable<AuthToken> {
  
    return this.http
      .get<{ id: string; email: string; password: string }[]>(
        `${this.urlBlogUocApi}?email=${auth.email}&password=${auth.password}`
      )
      .pipe(
        map((users: { id: string; email: string; password: string }[]) => {
          if (users.length > 0) {
            const user = users[0];
            return {
              user_id: user.id,
              access_token: 'fake-jwt-token-' + user.id,
            };
          } else {
            throw new Error('Credencials incorrectes');
          }
        })
      );
  }
}
