import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { NgModule  } from '@angular/core';

import { SignUpService } from './home/signup.service';

import { AppComponent } from './home/app.component';
import { HttpModule  , Http  } from '@angular/http';
import { LoginService } from './login/login.service';

import { LoginComponent } from './login/login.component';

import { routingComponents , AppRoutingModule} from './app-routing';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { LoginHomeComponent } from './login-home/login-home.component' ;
import { AuthenticationGuard } from './authentication.guard';
import { LoggedInCheckService } from './logged-in-check.service';
import { JwttokenService } from './jwttoken.service';
import { FriendsComponent } from './friends/friends.component';
import { InterceptorService } from './interceptor.service';
import { HTTP_INTERCEPTORS , HttpClientModule } from '@angular/common/http';
import { GetfriendsService } from './friends/getfriends.service';
import { ConnectPeopleComponent } from './connect-people/connect-people.component';
import { ConnectPeopleService } from './connect-people/connect-people.service';
import { ClickOutsideModule } from 'ng4-click-outside';
import { RequestsService } from "./requests/requests.service";


import {StompConfig, StompService} from '@stomp/ng2-stompjs';

import * as SockJS from 'sockjs-client';
import { RequestsComponent } from './requests/requests.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { CreateGroupService } from './create-group/create-group.service'

export function socketProvider() {
  //return new SockJS('http://localhost:8080/remember_server/socket' + '?Authorization=' + localStorage.getItem('Authorization') );
  return new WebSocket('ws://localhost:8080/remember_server/socket' + '?Authorization=' + localStorage.getItem('Authorization')); 
}

const stompConfig: StompConfig = {
  // Which server?
  url: socketProvider,

  // Headers
  // Typical keys: login, passcode, host
  headers: {
    Authorization: localStorage.getItem('Authorization'),
    passcode : "guest",
    ws : "true",
    'Content-Type' : 'text/plain'
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeat_in: 0, // Typical value 0 - disabled
  heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnect_delay: 0,

  // Will log diagnostics on console
  debug: true
};

//import * as SockJS from 'sockjs-client';

@NgModule({
  declarations: [   
    AppComponent , routingComponents, LoginComponent, LoginHomeComponent, FriendsComponent, ConnectPeopleComponent, RequestsComponent, CreateGroupComponent 
  ],
  imports: [     
    BrowserModule , HttpModule  , AppRoutingModule , FormsModule , ReactiveFormsModule  , HttpClientModule , ClickOutsideModule],
  providers: [ CreateGroupService ,RequestsService ,SignUpService , LoginService , AuthenticationGuard , LoggedInCheckService , JwttokenService  , GetfriendsService ,
                      ConnectPeopleService ,
                      StompService , 
                      {
                        provide: StompConfig,
                        useValue: stompConfig
                      },

  									{provide : HTTP_INTERCEPTORS ,
  									 useClass : InterceptorService,
  									 multi : true}],

  bootstrap: [AppComponent]
})
export class AppModule { }
