import { Inject, Injectable, signal } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _destroying$ = new Subject<void>();
  private _loginDisplay = new BehaviorSubject<boolean>(false);
  private _activeAccountReady = new BehaviorSubject<boolean>(false);
  activeAccountReady$ = this._activeAccountReady.asObservable();
  public userId = signal<string>('');

  loginDisplay$ = this._loginDisplay.asObservable();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

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

  updateLoginDisplay(): void {
    const isLoggedIn = this.msalService.instance.getAllAccounts().length > 0;

    if (isLoggedIn) {
      const account = this.msalService.instance.getActiveAccount();
      if (account) {
        this.userId.set(account.localAccountId);
        this._activeAccountReady.next(true);
      }
    }
    this._loginDisplay.next(isLoggedIn);
  }

  login() {
    if (this.msalGuardConfig.authRequest) {
      this.msalService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }

  logout() {
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200',
    });
  }

  destroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }
}
