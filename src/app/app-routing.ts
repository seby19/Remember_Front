import { NgModule }      from '@angular/core';
import { AppComponent }   from './home/app.component';
import { RouterModule , Routes} from '@angular/router';
import { LoginHomeComponent } from './login-home/login-home.component';
import { AuthenticationGuard } from './authentication.guard';


const routes : Routes = [
  					{path : 'login' , canActivate : [AuthenticationGuard] ,component : LoginHomeComponent }/*
  					{path : '' , redirectTo : '/view1' , pathMatch: 'full'},
  					{path : '**' , component : PageNotFound}*/
  					];

@NgModule({
  imports:      [RouterModule.forRoot(routes)],
  					
  exports : [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [AppComponent];