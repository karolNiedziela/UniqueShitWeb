import { Inject, Injectable } from '@angular/core';
import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
  RedirectRequest,
} from '@azure/msal-browser';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
import { AppUser, AppUserService } from '../services/app-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _destroying$ = new Subject<void>();
  private _loginDisplay = new BehaviorSubject<boolean>(false);
  private _activeAccountReady = new BehaviorSubject<boolean>(false);
  activeAccountReady$ = this._activeAccountReady.asObservable();

  private _currentUser = new BehaviorSubject<AppUser | null>(null);
  public currentUser$ = this._currentUser.asObservable();

  loginDisplay$ = this._loginDisplay.asObservable();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private appUserService: AppUserService
  ) {
    this.initializeAuth();
  }

  initializeAuth(): void {
    this.msalService.initialize();
    this.msalService.handleRedirectObservable().subscribe({
      next: (result: AuthenticationResult) => {
        if (
          !this.msalService.instance.getActiveAccount() &&
          this.msalService.instance.getAllAccounts().length > 0
        ) {
          this.msalService.instance.setActiveAccount(result.account);
          this._activeAccountReady.next(true);
          this.updateLoginDisplay();
        }
      },
      error: (error) => console.log(error),
    });

    this.msalService.instance.enableAccountStorageEvents();

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED ||
            msg.eventType === EventType.LOGIN_SUCCESS
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.updateLoginDisplay();
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.updateLoginDisplay();
      });
  }

  private updateLoginDisplay(): void {
    const isLoggedIn = this.msalService.instance.getAllAccounts().length > 0;
    this._loginDisplay.next(isLoggedIn);

    if (isLoggedIn) {
      const account = this.msalService.instance.getActiveAccount();
      if (account) {
        const id = account.localAccountId;
        this.appUserService.getUser(id).subscribe(user => {
          const logged: AppUser = {
            id: user.id,
            displayName: user.displayName,
            phoneNumber: user.phoneNumber,
            aboutMe: user.aboutMe,
            city: user.city,
          };
          this._currentUser.next(logged);
          this._activeAccountReady.next(true);
        });
      }
    } else {
      this._currentUser.next(null);
    }
  }

  login(): void {
    if (this.msalGuardConfig.authRequest) {
      this.msalService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }

  logout(): void {
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200',
    });
  }

  public userId(): string | null {
    return this._currentUser.value?.id ?? null;
  }

  destroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }
}
