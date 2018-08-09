import {Injectable , Inject , forwardRef , OnInit} from '@angular/core';
import { Http, Response , Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';

@Injectable()
export class GetfriendsService {

  private url : string = 'http://localhost:8080/remember_server/rem/getFriends'
	constructor(  private http : Http){

		
	}

	getFriends()
	{
		const headers = new Headers();
		headers.append('Content-Type', 'text/plain');
		headers.append('Authorization' , localStorage.getItem('Authorization'));
		const options = new RequestOptions({headers : headers});
		return this.http.post(this.url ,'' , options).map((response : Response) => response)
			.catch(this.errorHandle);
		
	}
	errorHandle(error : Response){
		//console.error("friends.service " + error);
		return Observable.throw(error || "Server Error");
		
	}


}
