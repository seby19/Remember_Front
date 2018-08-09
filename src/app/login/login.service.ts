import {Injectable , Inject , forwardRef , OnInit} from '@angular/core';
import { Http, Response , Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';




@Injectable()
export class LoginService{


	private url : string = 'http://localhost:8080/remember_server/login'
	constructor(@Inject(forwardRef(() => Http))   private http : Http){
		 
	}

	getLogin(loginData)
	{
		/*let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });*/

		return this.http.post(this.url , loginData /*, options*/).map((response : Response) => response.json())
		.catch(this.errorHandle);
		

		
	}
	errorHandle(error : Response){
		console.error(error);
		return Observable.throw(error || "Server Error");
		
	}

}
