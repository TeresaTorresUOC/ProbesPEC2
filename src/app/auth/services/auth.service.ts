import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthDTO } from '../models/auth.dto';
import { environment } from '../../../environments/environment';

interface UserRecord {
  id: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly urlBlogUocApi = `${environment.apiUrl.replace(/\/$/, '')}/users`;

  constructor(private http: HttpClient) {}
  login(credentials: { email: string; password: string }): Observable<AuthDTO> {
    const email = encodeURIComponent(credentials.email);
    const password = encodeURIComponent(credentials.password);
  
    return this.http
      .get<UserRecord[]>(`${this.urlBlogUocApi}?email=${email}&password=${password}`)
      .pipe(
        map((users) => {
          if (!users.length) {
            throw new Error('Credencials incorrectes');
          }
  
          const user = users[0];
          return new AuthDTO(user.id, `fake-jwt-token-${user.id}`);
        })
      );
  }
}  
