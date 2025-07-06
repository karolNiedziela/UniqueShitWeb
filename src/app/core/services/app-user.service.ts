import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  private baseUrl = `${environment.apiUrl}/app-users`;
  private cacheKey = 'userDisplayNameIdMap';

  constructor(private http: HttpClient) {}

  getUser(userId: string): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.baseUrl}/${userId}`).pipe(
      tap(user => {
        if (user && user.displayName) {
          // Zapisujemy powiązanie do sessionStorage
          this.cacheUserMapping(user.displayName, user.id);
        }
      })
    );
  }

  getUserIdByName(displayName: string): string | undefined {
    // 1. Spróbuj pobrać z sessionStorage
    const cache = this.getCache();
    const userId = cache[displayName];
    return userId;
  }

  private getCache(): { [key: string]: string } {
    try {
      const cachedData = sessionStorage.getItem(this.cacheKey);
      return cachedData ? JSON.parse(cachedData) : {};
    } catch (e) {
      console.error("Błąd odczytu cache'u użytkowników z sessionStorage", e);
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
    } catch (e) {
      console.error("Błąd zapisu do cache'u użytkowników w sessionStorage", e);
    }
  }

  updateUser(userData: UpdateAppUserDto): Observable<AppUser> {
    return this.http.patch<AppUser>(this.baseUrl, userData);
  }
}