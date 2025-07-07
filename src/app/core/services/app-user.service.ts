import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  aboutMe: string;
  city: string;
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
  private cacheKey = 'userDisplayNameIdMap';

  getUser(userId: string): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.baseUrl}/${userId}`).pipe(
      tap(user => {
        if (user?.displayName) {
          this.cacheUserMapping(user.displayName, user.id);
        }
      })
    );
  }

  getUserIdByName(displayName: string): string | undefined {
    const cache = this.getCache();
    return cache[displayName];
  }

  private getCache(): Record<string, string> {
    try {
      const data = sessionStorage.getItem(this.cacheKey);
      return data ? JSON.parse(data) : {};
    } catch {
      console.error('Error reading user cache');
      return {};
    }
  }

  public cacheUserMapping(displayName: string, userId: string): void {
    try {
      const cache = this.getCache();
      if (cache[displayName] !== userId) {
        cache[displayName] = userId;
        sessionStorage.setItem(this.cacheKey, JSON.stringify(cache));
      }
    } catch {
      console.error('Error writing user cache');
    }
  }

  updateUser(userData: UpdateAppUserDto): Observable<AppUser> {
    return this.http.patch<AppUser>(this.baseUrl, userData);
  }
}
