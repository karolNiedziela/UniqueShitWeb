import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { MatButtonModule } from '@angular/material/button';
import { TextAreaComponent } from '../shared/components/inputs/text-area/text-area.component';
import { OpenedChatsComponent } from '../modules/chat/opened-chats/opened-chats.component';
import { TextInputComponent } from '../shared/components/inputs/text-input/text-input.component';
import { AuthService } from '../core/auth/auth.service';
import { AppUserService, AppUser, UpdateAppUserDto } from '../core/services/app-user.service';
import { ChatService } from '../modules/chat/services/chat.service';

export interface ProfileState {
  isLoading: boolean;
  user?: AppUser;
  error?: string;
  isOwnProfile: boolean;
}

@Component({
  selector: 'app-profile',
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
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly appUserService = inject(AppUserService);
  private readonly coreAuthService = inject(AuthService);
  private readonly authService = inject(MsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  protected readonly chatService = inject(ChatService);

  private readonly profileStateSubject = new BehaviorSubject<ProfileState>({
    isLoading: true,
    isOwnProfile: false,
  });
  readonly profileState$ = this.profileStateSubject.asObservable();
  
  editMode = false;
  editForm!: FormGroup;
  isSaving = false;

  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const displayName = params.get('name');
        if (!displayName) {
          return of({ isLoading: false, error: 'Does not include username in the URL.', isOwnProfile: false });
        }
    
        const userId = this.appUserService.getUserIdByName(displayName); 
        if (!userId) {
          return of({ isLoading: false, error: 'The user could not be found.', isOwnProfile: false });
        }
        
        const isOwnProfile = userId === this.coreAuthService.userId();

        return this.appUserService.getUser(userId).pipe(
          map(user => ({ isLoading: false, user, isOwnProfile })),
          catchError(err => {
            console.error('Error loading profile:', err);
            return of({ isLoading: false, error: 'Failed to load profile.', isOwnProfile });
          })
        );
      }),

      tap(state => {
        if ('user' in state && state.user) {
          this.initializeForm(state.user);
        }
        this.profileStateSubject.next(state);
      }),
      takeUntil(this._destroying$)
    ).subscribe();

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(status => status === InteractionStatus.None || status === InteractionStatus.HandleRedirect),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });
  }
  
  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      const currentUser = this.profileStateSubject.getValue().user;
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
    const currentUser = this.profileStateSubject.getValue().user;
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

    this.appUserService.updateUser(payload).pipe(
      takeUntil(this._destroying$)
    ).subscribe({
      next: () => {
        this.isSaving = false;
        this.editMode = false;
        const currentState = this.profileStateSubject.getValue();
        const updatedUser = { ...currentState.user, ...payload } as AppUser;
        this.profileStateSubject.next({ ...currentState, user: updatedUser });
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