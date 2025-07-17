// C:\Users\KRUL\test22.06\UniqueShitWeb\src\app\profile\profile.component.ts

import { Component, inject, OnInit, signal, WritableSignal, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { MatButtonModule } from '@angular/material/button';
import { TextAreaComponent } from '../shared/components/inputs/text-area/text-area.component';
import { OpenedChatsComponent } from '../modules/chat/opened-chats/opened-chats.component';
import { TextInputComponent } from '../shared/components/inputs/text-input/text-input.component';
import { AuthService } from '../core/auth/auth.service';
import { ChatService } from '../modules/chat/services/chat.service';
import { LoggedUserService, AppUser, UpdateAppUserDto } from '../modules/logged-user/logged-user.service';

export interface ProfileState {
  isLoading: boolean;
  user?: AppUser;
  error?: string;
  isOwnProfile: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true, // Pamiętaj o ustawieniu standalone, jeśli tak jest w projekcie
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    TextAreaComponent,
    TextInputComponent,
    OpenedChatsComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly appUserService = inject(LoggedUserService);
  private readonly coreAuthService = inject(AuthService);
  private readonly authService = inject(MsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly chatService = inject(ChatService);

  // Zastępujemy BehaviorSubject sygnałem
  profileState: WritableSignal<ProfileState> = signal({
    isLoading: true,
    isOwnProfile: false,
  });
  
  editMode = false;
  editForm!: FormGroup;
  isSaving = false;

  ngOnInit(): void {
    // Strumień z parametrami trasy. Subskrypcja jest automatycznie czyszczona.
    this.route.paramMap.pipe(
      switchMap(params => {
        const userIdFromRoute = params.get('id');
        
        if (!userIdFromRoute) {
          return of<ProfileState>({ isLoading: false, error: 'User ID not found in URL.', isOwnProfile: false });
        }
  
        const isOwnProfile = userIdFromRoute === this.coreAuthService.userId();

        return this.appUserService.getUser(userIdFromRoute).pipe(
          map(user => ({ isLoading: false, user, isOwnProfile })),
          catchError(err => {
            console.error('Error loading profile:', err);
            return of<ProfileState>({ isLoading: false, error: 'Failed to load profile. User may not exist.', isOwnProfile });
          })
        );
      }),
      // Wewnątrz tap aktualizujemy sygnał
      tap(state => {
        this.profileState.set(state);
        if (state.user) {
          this.initializeForm(state.user);
        }
      })
    ).subscribe(); // Subskrypcja jest potrzebna, aby uruchomić strumień

    // Używamy takeUntilDestroyed do automatycznego czyszczenia subskrypcji
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(status => status === InteractionStatus.None || status === InteractionStatus.HandleRedirect),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });
  }
  
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      // Odczytujemy wartość z sygnału przez jego wywołanie: this.profileState()
      const currentUser = this.profileState().user;
      if (currentUser) {
        this.editForm.reset({
          phoneNumber: currentUser.phoneNumber || '',
          city: currentUser.city || '',
          aboutMe: currentUser.aboutMe || '',
        });
      }
    }
  }

  saveChanges(): void {
    if (this.editForm.invalid || this.isSaving) return;
    
    this.isSaving = true;
    const formValues = this.editForm.value;
    // Odczytujemy wartość z sygnału: this.profileState()
    const currentUser = this.profileState().user;
    if (!currentUser) {
      this.isSaving = false;
      return;
    }

    const payload: UpdateAppUserDto = {};
    Object.keys(formValues).forEach(key => {
      const formValue = (formValues[key] || '').trim();
      const userValue = (currentUser as any)[key] || '';
      if (formValue !== userValue) {
        (payload as any)[key] = formValue;
      }
    });

    if (Object.keys(payload).length === 0) {
      this.isSaving = false;
      this.editMode = false;
      return;
    }

    this.appUserService.updateUser(payload)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.isSaving = false;
        this.editMode = false;
        // Używamy .update() do aktualizacji stanu na podstawie poprzedniej wartości
        this.profileState.update(currentState => {
            const updatedUser = { ...currentState.user, ...payload } as AppUser;
            return { ...currentState, user: updatedUser };
        });
      },
      error: err => {
        console.error('Profile update error:', err);
        this.isSaving = false;
      }
    });
  }

  private initializeForm(user: AppUser): void {
    this.editForm = this.fb.group({
      phoneNumber: [user.phoneNumber || ''],
      city: [user.city || ''],
      aboutMe: [
        user.aboutMe || '',
        [Validators.maxLength(512), this.maxParagraphsValidator(8)],
      ],
    });
  }
  
  private maxParagraphsValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value ?? '';
      const paragraphs = value.split(/\r?\n/).filter(p => p.trim() !== '');
      return paragraphs.length > max
        ? { maxParagraphs: { actual: paragraphs.length, maxAllowed: max } }
        : null;
    };
  }

  private checkAndSetActiveAccount(): void {
    let activeAccount = this.authService.instance.getActiveAccount();
    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }
}