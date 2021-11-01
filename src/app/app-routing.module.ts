import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompletedTasksComponent } from './pages/completed-tasks/completed-tasks.component';
import { DailyTasksComponent } from './pages/daily-tasks/daily-tasks.component';
import { ListsComponent } from './pages/lists/lists.component';

const routes: Routes = [
  {
    path: 'completed',
    component: CompletedTasksComponent,
  },
  {
    path: ':list',
    component: ListsComponent,
  },
  {
    path: '',
    component: DailyTasksComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule],
})
export class AppRoutingModule {}
