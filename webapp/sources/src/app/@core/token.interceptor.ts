import { Inject, Injectable, Injector } from '@angular/core';
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER, NbAuthService, NbAuthToken } from '@nebular/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    } from '@angular/common/http';

@Injectable()
export class CustomNbAuthJWTInterceptor implements HttpInterceptor {

  constructor(private injector: Injector, private router: Router,
              @Inject(NB_AUTH_TOKEN_INTERCEPTOR_FILTER) protected filter) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // do not intercept request whose urls are filtered by the injected filter
      if (!this.filter(req) && !this.isRequestAllowed(req)) {
        return this.authService.isAuthenticatedOrRefresh()
          .pipe(
            switchMap(authenticated => {
              if (authenticated) {
                  return this.authService.getToken().pipe(
                    switchMap((token: NbAuthToken) => {
                      const JWT = `${token.getPayload().id_token}`;
                      req = req.clone({
                        setHeaders: {
                          Authorization: JWT,
                        },
                      });
                      return next.handle(req);
                    }),
                  );
              } else {
                 // Request is sent to server without authentication so that the client code
                 // receives the 401/403 error and can act as desired ('session expired', redirect to login, aso)
                return next.handle(req).pipe(tap(() => {},
                (err: any) => {
                if (err instanceof HttpErrorResponse) {
                  if (err.status !== 401) {
                   return;
                  }
                  this.router.navigate(['auth/login']);
                }
              }));
              }
            }),
          );
      } else {
      return next.handle(req);
    }
  }

  private isRequestAllowed(req: HttpRequest<any>): boolean {
    return req.url.indexOf('x-amz-security-token') > 0;
  }

  protected get authService(): NbAuthService {
    return this.injector.get(NbAuthService);
  }

}
