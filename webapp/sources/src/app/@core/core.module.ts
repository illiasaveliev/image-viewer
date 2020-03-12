import { CommonModule } from '@angular/common';
import { CustomNbAuthJWTInterceptor } from './token.interceptor';
import { environment } from '../../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImagesData } from './data/images';
import { ImagesService } from './services/images.service';
import { LayoutService, StateService } from './utils';
import { NbRoleProvider, NbSecurityModule } from '@nebular/security';
import { of as observableOf } from 'rxjs';
import { ServicesDataModule } from './services/services-data.module';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { UserData } from './data/users';
import { UserService } from './services/users.service';
import {
  NB_AUTH_TOKEN_INTERCEPTOR_FILTER,
  NbAuthModule,
  NbAuthOAuth2Token,
  NbOAuth2AuthStrategy,
  NbOAuth2ClientAuthMethod,
  NbOAuth2GrantType,
  NbOAuth2ResponseType,
  NbTokenLocalStorage,
  NbTokenStorage,
  } from '@nebular/auth';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
  } from '@angular/core';

const DATA_SERVICES = [
  { provide: UserData, useClass: UserService },
  { provide: ImagesData, useClass: ImagesService },
];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [
  ...ServicesDataModule.forRoot().providers,
  ...DATA_SERVICES,
  ...NbAuthModule.forRoot({

    strategies: [
      NbOAuth2AuthStrategy.setup({
        name: 'email',
        baseEndpoint: environment.authUrl,
        clientId: environment.clientId,
        clientSecret: environment.clientSecret,
        clientAuthMethod: NbOAuth2ClientAuthMethod.NONE,
        redirect: {
          success: '/',
          failure: null,
        },
        defaultErrors: ['Something went wrong, please try again.'],
        defaultMessages: ['You have been successfully authenticated.'],
        authorize: {
          endpoint: 'authorize',
          responseType: NbOAuth2ResponseType.TOKEN,
          redirectUri: environment.redirectUrl,
        },
        token: {
          endpoint: 'token',
          grantType: NbOAuth2GrantType.AUTHORIZATION_CODE,
          requireValidToken: true,
          class: NbAuthOAuth2Token,
          redirectUri: environment.redirectUrl,
        },
        refresh: {
          endpoint: 'token',
          grantType: NbOAuth2GrantType.REFRESH_TOKEN,
        },
      }),
    ],
    forms: {
      login: {
        socialLinks: [],
      },
      register: {
        socialLinks: [],
      },
    },
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,

  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  {
    provide: NbTokenStorage, useClass: NbTokenLocalStorage,
  },
  {
    provide: HTTP_INTERCEPTORS, useClass: CustomNbAuthJWTInterceptor, multi: true,
  },
  { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: () => false },
  LayoutService,
  StateService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
