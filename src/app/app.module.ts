import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatComponentsModule } from './mat-components/mat-components.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { AppComponent } from './app.component';
import { SideNavBarComponent } from './layouts/side-nav-bar/side-nav-bar.component';
import { DailyTasksComponent } from './pages/daily-tasks/daily-tasks.component';
import { ListsComponent } from './pages/lists/lists.component';
import { TaskComponent } from './shared/components/task/task.component';
import { CompletedTasksComponent } from './pages/completed-tasks/completed-tasks.component';
import { CompletedTaskComponent } from './shared/components/completed-task/completed-task.component';
import { TaskDialogComponent } from './shared/components/task-dialog/task-dialog.component';
import { ListDialogComponent } from './shared/components/list-dialog/list-dialog.component';
import { TaskSkeletonComponent } from './shared/components/task-skeleton/task-skeleton.component';



@NgModule({
  declarations: [
    AppComponent,
    SideNavBarComponent,
    DailyTasksComponent,
    ListsComponent,
    TaskComponent,
    CompletedTasksComponent,
    CompletedTaskComponent,
    TaskDialogComponent,
    ListDialogComponent,
    TaskSkeletonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatComponentsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
