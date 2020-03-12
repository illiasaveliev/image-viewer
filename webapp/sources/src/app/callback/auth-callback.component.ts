import { Component, OnDestroy } from '@angular/core';
import { NbAuthResult, NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Component({
    selector: 'nb-playground-oauth2-callback',
    template: `
      
        Authenticating...
    
    `,
  })
  export class NbOAuth2CallbackComponent implements OnDestroy {

    alive = true;

    constructor(private authService: NbAuthService, private router: Router) {
      this.authService.authenticate('email')
        .pipe(takeWhile(() => this.alive))
        .subscribe((authResult: NbAuthResult) => {
          if (authResult.isSuccess()) {
            this.router.navigateByUrl('');
          }
        });
    }

    ngOnDestroy(): void {
      this.alive = false;
    }
  }