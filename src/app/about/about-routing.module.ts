import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Routes, RouterModule, RouterStateSnapshot } from '@angular/router';


import { AboutPage } from './about.page';


const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Créditos', imagePath: './assets/img/question.png' },
    component: AboutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutPageRoutingModule { }
