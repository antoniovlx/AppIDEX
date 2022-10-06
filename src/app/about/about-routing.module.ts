import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

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
  exports: [RouterModule],
})
export class AboutPageRoutingModule {}
