import { Injectable } from '@angular/core';
import { Http, Response , Headers , RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Message} from 'stompjs';
import { Subscription } from 'rxjs/Subscription';
import {StompService} from '@stomp/ng2-stompjs';


@Injectable()
export class CreateGroupService {

  private url : string = 'http://localhost:8080/remember_server/rem/CreateGroup'
  private url2 : string = 'http://localhost:8080/remember_server/rem/getFriendsToAdd'

  public messages: Observable<Message>;

  
  constructor( private http : Http ,  private stompService : StompService) { }

  GroupGenerate( group)
  {
    const headers = new Headers();
		headers.append('Authorization' , localStorage.getItem('Authorization'));
    const options = new RequestOptions({headers : headers});
    
    return this.http.post(this.url , group , options).map( (response : Response ) =>response.json())
            .catch(this.errorHandle)
  }
  errorHandle(error : Response){
		console.error(error);
		return Observable.throw(error || "Server Error");
		
  }
	InternalsendGroup(group)
	{
		const headers = new Headers();
			headers.append('Content-Type', 'text/plain');
		  headers.append('Authorization' , localStorage.getItem('Authorization'));
		this.stompService.publish("/broker/internal/" + localStorage.getItem("username").toLowerCase() +'/queue/newGroup'   , group.id + " "
					+ group.groupDesc + " " + group.adminId + " " + group.groupName ,  {headers : headers});
	}
  getFriendsToAdd(groupId)
	{
		const headers = new Headers();
		headers.append('Authorization' , localStorage.getItem('Authorization'));
		const options = new RequestOptions({headers : headers});
		return this.http.post(this.url2 , groupId , options).map((response : Response) => response)
			.catch(this.errorHandle);
		
	}
  
  initializeWebSocketConnection(){

		const headers = new Headers();
		  headers.append('Content-Type', 'text/plain');
		  headers.append('Authorization' , localStorage.getItem('Authorization'));
		  
		  //This is used to subscribe to you're self
		  //this.messages2 = this.stompService.subscribe('/user/' + localStorage.getItem("username").toLowerCase() +'/queue/showFriends' , {headers : headers});
	  
	  
		  this.messages = this.stompService.subscribe('/broker/' + localStorage.getItem("username").toLowerCase() +'/queue/newGroup' , {headers : headers});
		  console.log("in socket");
		  return this.messages;
		  //this.subscription = this.messages.subscribe(this.on_next);
	   
    }
    
    addPerson(ppl , groupId){
      const headers = new Headers();
		  headers.append('Content-Type', 'text/plain');
		  headers.append('Authorization' , localStorage.getItem('Authorization'));
		  const options = new RequestOptions({headers : headers});

	    this.stompService.publish("/rem/addPersonToGroup/" + ppl.username.toLowerCase()  , groupId,  {headers : headers});
	    
    }

}
