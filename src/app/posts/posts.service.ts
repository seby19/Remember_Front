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

  private url : string = 'http://localhost:8080/remember_server/rem/getPosts'

  constructor(private http : Http , private stompService : StompService) { }

  getPosts(groupId)
  {
    const headers = new Headers();
		headers.append('Authorization' , localStorage.getItem('Authorization'));
    const options = new RequestOptions({headers : headers});
    console.log("service grp id post " + groupId);
		return this.http.post(this.url , groupId , options).map((response : Response) => response)
			.catch(this.errorHandle);
  }
  errorHandle(error : Response){
		//console.error("friends.service " + error);
		return Observable.throw(error || "Server Error");
		
	}
}
