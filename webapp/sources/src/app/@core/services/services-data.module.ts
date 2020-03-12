import { CommonModule } from '@angular/common';
import { ImagesService } from './images.service';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { UserService } from './users.service';


const SERVICES = [
  ImagesService,
  UserService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class ServicesDataModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ServicesDataModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
