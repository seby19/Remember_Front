import { Injectable } from '@angular/core';
import { Http, Response , Headers , RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';



@Injectable()
export class CreateGroupService {

  private url : string = 'http://localhost:8080/remember_server/rem/CreateGroup'

  
  constructor( private http : Http) { }

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

}
