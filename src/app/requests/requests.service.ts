import { Injectable } from '@angular/core';
import { Http, Response , Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';


import {Message} from 'stompjs';
import { Subscription } from 'rxjs/Subscription';
import {StompService} from '@stomp/ng2-stompjs';

@Injectable()
export class RequestsService {

  private subscription: Subscription;
  public messages: Observable<Message>;
  private stompClient;
    
  private url : string = 'http://localhost:8080/remember_server/rem/getConnectionsRequests'
  private acceptUrl : string = 'http://localhost:8080/remember_server/rem/getConnectionsRequests'
  private rejectUrl : string = 'http://localhost:8080/remember_server/rem/getConnectionsRequests'
  constructor( private http : Http , private stompService : StompService ) { }

  getRequests()
  {
    const headers = new Headers();
		headers.append('Content-Type', 'text/plain');
		headers.append('Authorization' , localStorage.getItem('Authorization'));
		const options = new RequestOptions({headers : headers});
		return this.http.post(this.url ,'' , options).map((response : Response) => response)
			.catch(this.errorHandle);
  }
  errorHandle(error : Response){
		//console.error("connect-people.service " + error);
		return Observable.throw(error || "Server Error");
		
  }
  
  acceptConnection(ppl){
    const headers = new Headers();
		headers.append('Content-Type', 'text/plain');
		headers.append('Authorization' , localStorage.getItem('Authorization'));
		const options = new RequestOptions({headers : headers});
		return this.http.post(this.acceptUrl ,'' , options).map((response : Response) => response)
			.catch(this.errorHandle);
  }

  rejectConnection(ppl){
    const headers = new Headers();
		headers.append('Content-Type', 'text/plain');
		headers.append('Authorization' , localStorage.getItem('Authorization'));
		const options = new RequestOptions({headers : headers});
		return this.http.post(this.rejectUrl ,'' , options).map((response : Response) => response)
			.catch(this.errorHandle);
  }

  initializeWebSocketConnection(){

  const headers = new Headers();
	headers.append('Content-Type', 'text/plain');
	headers.append('Authorization' , localStorage.getItem('Authorization'));
	
	//This is used to subscribe to you're self
	//this.messages2 = this.stompService.subscribe('/user/' + localStorage.getItem("username").toLowerCase() +'/queue/showFriends' , {headers : headers});


	this.messages = this.stompService.subscribe('/broker/' + localStorage.getItem("username").toLowerCase() +'/queue/showFriends' , {headers : headers});
	
	
	this.subscription = this.messages.subscribe(this.on_next);
 
  }
  public on_next = (message: Message ) => {
    console.log(message.username + "from server");
	}

}
