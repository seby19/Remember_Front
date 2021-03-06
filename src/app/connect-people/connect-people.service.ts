import {Injectable , Inject , forwardRef , OnInit  } from '@angular/core';
import { Http, Response , Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';


import {Message} from 'stompjs';
import { Subscription } from 'rxjs/Subscription';
import {StompService} from '@stomp/ng2-stompjs';


import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Injectable()
export class ConnectPeopleService {

  	private subscription: Subscription;
  	private subscription2: Subscription;
	public messages: Observable<Message>;
	public messages2: Observable<Message>;
	private stompClient;
  
  private url : string = 'http://localhost:8080/remember_server/rem/getPeople'
	constructor(  private http : Http , private stompService : StompService ){
		//this.initializeWebSocketConnection();
		
	}

	getPeople()
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
	

  	
	
	initializeWebSocketConnection(){

    const headers = new Headers();
	headers.append('Content-Type', 'text/plain');
	headers.append('Authorization' , localStorage.getItem('Authorization'));
	
	//This is used to subscribe to you're self
	//this.messages2 = this.stompService.subscribe('/user/' + localStorage.getItem("username").toLowerCase() +'/queue/showFriends' , {headers : headers});


	this.messages2 = this.stompService.subscribe('/broker/' + localStorage.getItem("username").toLowerCase() +'/queue/showFriends' , {headers : headers});
	
	return this.messages2;
	//this.subscription2 = this.messages2.subscribe(this.on_next);

 
	}

	/*public on_next = (message: Message ) => {

	
    console.log(message.username + "from server");
	}*/


	  sendConnect(ppl){
	  	const headers = new Headers();
		headers.append('Content-Type', 'text/plain');
		headers.append('Authorization' , localStorage.getItem('Authorization'));
		const options = new RequestOptions({headers : headers});

	    this.stompService.publish("/rem/getConnections/" + ppl.username.toLowerCase()  , ppl.id ,  {headers : headers});
	    
	    // used to send message directly to user wit out server intercept controller
	    //this.stompService.publish("/user/" + ppl.username.toLowerCase() + "/queue/showFriends" , "hello " + ppl.username.toLowerCase() 
	    //			+ " from " +  localStorage.getItem("username").toLowerCase() + " " ,  {headers : headers});

	  }




}
