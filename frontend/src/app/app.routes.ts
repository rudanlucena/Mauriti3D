import { Routes } from '@angular/router';
import { KanbanComponent } from './pedido/kanban/kanban.component';
import { CalendarioComponent } from './data-comemorativa/calendario/calendario.component';

export const routes: Routes = [
  { path: '', redirectTo: 'kanban', pathMatch: 'full' },
  { path: 'kanban', component: KanbanComponent },
  { path: 'calendario', component: CalendarioComponent }
];
