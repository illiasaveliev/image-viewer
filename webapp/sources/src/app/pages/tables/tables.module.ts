import { FsIconComponent } from './tree-grid/tree-grid.component';
import { ngfModule } from 'angular-file';
import { NgModule } from '@angular/core';
import { routedComponents, TablesRoutingModule } from './tables-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import {
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
  NbButtonModule,
  } from '@nebular/theme';


@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    ThemeModule,
    TablesRoutingModule,
    ngfModule,
  ],
  declarations: [
    ...routedComponents,
    FsIconComponent,
  ],
})
export class TablesModule { }
