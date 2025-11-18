import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthDTO } from '../models/auth.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(credentials: { email: string; password: string }): Observable<AuthDTO> {
  
    return of(new AuthDTO(1, 'fake_access_token'));
  }
}
