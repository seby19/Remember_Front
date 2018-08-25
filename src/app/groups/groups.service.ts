import { Injectable } from '@angular/core';
import { Http, Response , Headers , RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Message} from 'stompjs';
import { Subscription } from 'rxjs/Subscription';
import {StompService} from '@stomp/ng2-stompjs';

@Injectable()
export class GroupsService {

  private url : string = 'http://localhost:8080/remember_server/rem/getGroups'
  private url2 : string = 'http://localhost:8080/remember_server/rem/getFriendsToAdd'

  public messages: Observable<Message>;

  constructor(private http : Http ,  private stompService : StompService) { }

  getGroups()
  {
    const headers = new Headers();
    headers.append('Content-Type', 'text/plain');
		headers.append('Authorization' , localStorage.getItem('Authorization'));
    const options = new RequestOptions({headers : headers});
    
    return this.http.post(this.url , '' , options).map( (response : Response ) =>response)
            .catch(this.errorHandle)
  }
  errorHandle(error : Response){
		console.error(error);
		return Observable.throw(error || "Server Error");
		
  }

  internalIntializeWebSocket(){
    const headers = new Headers();
		  headers.append('Content-Type', 'text/plain');
		  headers.append('Authorization' , localStorage.getItem('Authorization'));
		  
		  //This is used to subscribe to you're self
		  //this.messages2 = this.stompService.subscribe('/user/' + localStorage.getItem("username").toLowerCase() +'/queue/showFriends' , {headers : headers});
	  
	  
		  this.messages = this.stompService.subscribe("/broker/internal/" + localStorage.getItem("username").toLowerCase() +'/queue/newGroup'   , {headers : headers});
		  console.log("in socket");
		  return this.messages;
  }

}
