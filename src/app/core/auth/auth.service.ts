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
import { filter, Subject, takeUntil } from 'rxjs';
import { AppUser, LoggedUserService } from '../../modules/logged-user/logged-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _destroying$ = new Subject<void>();

  // Sygnały są publiczne i bezpośrednio zapisywalne.
  public currentUser = signal<AppUser | null>(null);
  public loginDisplay = signal<boolean>(false);
  // POPRAWKA: Ta linia została przeoczona i teraz jest dodana
  public activeAccountReady = signal<boolean>(false); 

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private loggedUserService: LoggedUserService
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
          this.activeAccountReady.set(true); // Wywołanie jest teraz poprawne, bo sygnał istnieje
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
    this.loginDisplay.set(isLoggedIn);

    if (isLoggedIn) {
      const account = this.msalService.instance.getActiveAccount();
      if (account) {
        const id = account.localAccountId;
        this.loggedUserService.getUser(id).subscribe(user => {
          const logged: AppUser = {
            id: user.id,
            displayName: user.displayName,
            phoneNumber: user.phoneNumber,
            aboutMe: user.aboutMe,
            city: user.city,
          };
          this.currentUser.set(logged);
          this.activeAccountReady.set(true); // Wywołanie jest teraz poprawne
        });
      }
    } else {
      this.currentUser.set(null);
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
    return this.currentUser()?.id ?? null;
  }

  destroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }
}
