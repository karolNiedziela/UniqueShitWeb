import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AppUser {
  id: string;
  displayName: string;
  phoneNumber?: string;
  aboutMe?: string;
  city?: string;
}

export interface UpdateAppUserDto {
  phoneNumber?: string;
  aboutMe?: string;
  city?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppUserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/app-users`;

  getUser(userId: string): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.baseUrl}/${userId}`);
  }

  updateUser(userData: UpdateAppUserDto): Observable<AppUser> {
    return this.http.patch<AppUser>(this.baseUrl, userData);
  }
}
