import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable()
export class CustomAuthInterceptor implements HttpInterceptor {
  constructor(private msalService: MsalService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const requiresAuth = this.shouldAttachToken(req);

    if (!requiresAuth) {
      return next.handle(req);
    }

    return from(
      this.msalService.instance.acquireTokenSilent({
        scopes: environment.adb2c.scopeUrls,
        account: this.msalService.instance.getAllAccounts()[0],
      })
    ).pipe(
      switchMap((result) => {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${result.accessToken}`,
          },
        });
        return next.handle(authReq);
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  private shouldAttachToken(req: HttpRequest<any>): boolean {
    const rules = [
      { url: `${environment.apiUrl}/sale-offers`, method: 'POST' },
    ];

    return rules.some(
      (rule) =>
        req.url.startsWith(rule.url) && req.method.toUpperCase() === rule.method
    );
  }
}
