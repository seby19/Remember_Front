import {Injectable , Inject , forwardRef , OnInit} from '@angular/core';
import { Http, Response , Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';


import {Message} from 'stompjs';
import { Subscription } from 'rxjs/Subscription';
import {StompService} from '@stomp/ng2-stompjs';


@Injectable()
export class PostsService {

  private subscription: Subscription;
	public messages2: Observable<Message>;
	private stompClient;

  private url : string = 'http://localhost:8080/remember_server/rem/getPosts'

  constructor(private http : Http , private stompService : StompService) { }

  getPosts(groupId)
  {
    const headers = new Headers();
		headers.append('Authorization' , localStorage.getItem('Authorization'));
    const options = new RequestOptions({headers : headers});
    //console.log("service grp id post " + groupId);
		return this.http.post(this.url , groupId , options).map((response : Response) => response)
			.catch(this.errorHandle);
  }
  errorHandle(error : Response){
		//console.error("friends.service " + error);
		return Observable.throw(error || "Server Error");
		
  }
  sendPost(postData , groupId )
  {
    const headers = new Headers();
		headers.append('Content-Type', 'text/plain');
		headers.append('Authorization' , localStorage.getItem('Authorization'));
		const options = new RequestOptions({headers : headers});

	    this.stompService.publish("/rem/setPost/" + groupId  , postData ,  {headers : headers});
  }

  initializeWebSocketConnection(groupId){

    const headers = new Headers();
    headers.append('Content-Type', 'text/plain');
    headers.append('Authorization' , localStorage.getItem('Authorization'));
    
    //This is used to subscribe to you're self
    //this.messages2 = this.stompService.subscribe('/user/' + localStorage.getItem("username").toLowerCase() +'/queue/showFriends' , {headers : headers});


    this.messages2 = this.stompService.subscribe('/broker/' + groupId +'/queue/newPost' , {headers : headers});
    
    return this.messages2;
    //this.subscription2 = this.messages2.subscribe(this.on_next);

 
	}
}
