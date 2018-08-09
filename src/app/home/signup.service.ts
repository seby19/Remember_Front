import {Injectable , Inject , forwardRef} from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';


@Injectable()
export class SignUpService{
	private url : string = 'http://localhost:8080/remember_server/signup'
	constructor( @Inject(forwardRef(() => Http)) private http : Http){}

	signUp(signup)
	{
		//console.log("in sign up service")
		return this.http.post(this.url , signup).map((response : Response) => response.json())
			.catch(this.errorHandle)
		
	}
	errorHandle(error : Response){
		console.error(error);
		return Observable.throw(error || "Server Error");
		
	}
}
