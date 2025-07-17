// src/app/modules/logged-user/logged-user.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
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

// Możemy też dodać stan ładowania i błędu
export interface UserState {
  user: AppUser | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class LoggedUserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/app-users`;

  // Prywatny, zapisywalny sygnał przechowujący stan
  private userState: WritableSignal<UserState> = signal<UserState>({
    user: null,
    isLoading: false,
    error: null,
  });

  // Publiczne, tylko do odczytu sygnały, aby komponenty nie mogły modyfikować stanu bezpośrednio
  public readonly currentUser = this.userState.asReadonly();

  // Metoda, która ładuje użytkownika i aktualizuje sygnał
  loadUser(userId: string): void {
    this.userState.set({ user: null, isLoading: true, error: null });

    this.http.get<AppUser>(`${this.baseUrl}/${userId}`).subscribe({
      next: (user) => {
        this.userState.set({ user: user, isLoading: false, error: null });
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.userState.set({ user: null, isLoading: false, error: 'Failed to load user data.' });
      }
    });
  }
  
  // Ta metoda może pozostać dla innych zastosowań, jeśli są
  getUser(userId: string): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.baseUrl}/${userId}`);
  }

  updateUser(userData: UpdateAppUserDto): Observable<AppUser> {
    return this.http.patch<AppUser>(this.baseUrl, userData).pipe(
      // Po pomyślnej aktualizacji, zaktualizujmy nasz stan
      tap(updatedUser => {
        this.userState.update(state => ({
            ...state,
            user: updatedUser
        }));
      })
    );
  }
}