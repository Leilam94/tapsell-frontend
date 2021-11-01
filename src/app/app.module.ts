import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideNavBarComponent } from './layouts/side-nav-bar/side-nav-bar.component';
import { MatComponentsModule } from './mat-components/mat-components.module';
import { DailyTasksComponent } from './pages/daily-tasks/daily-tasks.component';
import { ListsComponent } from './pages/lists/lists.component';
import { TaskComponent } from './shared/components/task/task.component';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { CompletedTasksComponent } from './pages/completed-tasks/completed-tasks.component';
import { CompletedTaskComponent } from './shared/components/completed-task/completed-task.component';
import { TaskDialogComponent } from './shared/components/task-dialog/task-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    SideNavBarComponent,
    DailyTasksComponent,
    ListsComponent,
    TaskComponent,
    DialogComponent,
    CompletedTasksComponent,
    CompletedTaskComponent,
    TaskDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatComponentsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
