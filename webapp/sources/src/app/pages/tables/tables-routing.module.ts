import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablesComponent } from './tables.component';
import { TreeGridComponent } from './tree-grid/tree-grid.component';


const routes: Routes = [{
  path: '',
  component: TablesComponent,
  children: [
    {
      path: '',
      component: TreeGridComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  TablesComponent,
  TreeGridComponent,
];
