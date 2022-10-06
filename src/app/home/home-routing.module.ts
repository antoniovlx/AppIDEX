import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    data: { breadcrumb: 'Home', imagePath: './assets/img/recursos-naturales.png' },
    children: [
      {
        path: 'entradas',
        loadChildren: () => import('../entradas/entradas.module').then(m => m.EntradasPageModule)
      },
      {
        path: 'preguntas',
        loadChildren: () => import('../preguntas/preguntas.module').then(m => m.PreguntasPageModule)
      },
      {
        path: 'resultados',
        loadChildren: () => import('../resultados/resultados.module').then(m => m.ResultadosPageModule)
      },
      {
        path: '',
        redirectTo: '/home/entradas',
        pathMatch: 'full'
      }

    ]
  },
  {
    path: '',
    redirectTo: '/home/entradas',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
