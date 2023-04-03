import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Http404Component } from './http404/http404.component';

const routes: Routes = [
  {
    path: 'portal',
    loadChildren: () => import('./portal/portal.module').then(x => x.PortalModule),
    canActivate: [],
  },
  {
    path: '',
    redirectTo: '/portal/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: Http404Component,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
