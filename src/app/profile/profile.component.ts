import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, takeUntil, tap, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/auth/auth.service';
import { AppUserService, AppUser, UpdateAppUserDto } from '../core/services/app-user.service';
import { TextAreaComponent } from '../shared/components/inputs/text-area/text-area.component';
import { ChatService } from '../modules/chat/services/chat.service';
import { OpenedChatsComponent } from '../modules/chat/opened-chats/opened-chats.component';

export interface ProfileState {
  isLoading: boolean;
  user?: AppUser;
  error?: string;
  isOwnProfile: boolean;
}
export class Claim {
  id: number = 0;
  claim: string = '';
  value: string = '';
}

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    TextAreaComponent,
    RouterModule,
    OpenedChatsComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly appUserService = inject(AppUserService);
  private readonly coreAuthService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  protected readonly chatService = inject(ChatService);

  profileState$!: Observable<ProfileState>;

  editMode = false;
  editForm!: FormGroup;
  isSaving = false;

  private readonly _destroying$ = new Subject<void>();
  
  constructor(
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {
    this.profileState$ = this.route.paramMap.pipe(
      switchMap(params => {
        const displayName = params.get('name');
        if (!displayName) {
          return of({ isLoading: false, error: 'User name not found in URL.', isOwnProfile: false });
        }
        
        const userId = this.appUserService.getUserIdByName(displayName);
        if (!userId) {
          return of({ isLoading: false, error: 'Could not find user.', isOwnProfile: false });
        }
        
        const isOwnProfile = userId === this.coreAuthService.userId();

        return this.appUserService.getUser(userId).pipe(
          tap(user => this.initializeForm(user)),
          map(user => ({ isLoading: false, user, isOwnProfile })),
          catchError(err => {
            console.error('Profile error:', err);
            return of({ isLoading: false, error: 'Failed to load profile.', isOwnProfile });
          })
        );
      }),
      startWith({ isLoading: true, isOwnProfile: false }),
      takeUntil(this._destroying$)
    );

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None || status === InteractionStatus.HandleRedirect),
        takeUntil(this._destroying$)
      )
      .subscribe(() => this.checkAndSetActiveAccount());
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.profileState$.pipe(take(1)).subscribe((state: ProfileState) => {
        if (state.user) {
          this.initializeForm(state.user);
        }
      });
    }
  }

  saveChanges(currentUser: AppUser): void {
    if (!this.editForm.valid || this.isSaving) return;
    
    this.isSaving = true;
    const formValues = this.editForm.value;

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
      .pipe(takeUntil(this._destroying$))
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.editMode = false;
          window.location.reload(); 
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
      aboutMe: [user.aboutMe || '', Validators.maxLength(512)],
    });
  }

  private checkAndSetActiveAccount(): void {
    let activeAccount = this.authService.instance.getActiveAccount();
    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      this.authService.instance.setActiveAccount(this.authService.instance.getAllAccounts()[0]);
    }
  }
}