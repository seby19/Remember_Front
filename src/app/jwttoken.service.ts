import {Injectable , Inject , forwardRef , OnInit} from '@angular/core';
import { Http, Response , Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';

@Injectable()
export class JwttokenService {

  jwtToken : string;
  private url : string = 'http://localhost:8080/remember_server/token';

  constructor(@Inject(forwardRef(() => Http))   private http : Http) { }

  getToken(user)
  {
  	//console.log("in service");
  	return this.http.post(this.url , user ).map((response : Response) => response.text())
		.catch(this.errorHandle);
  }
  errorHandle(error : Response){
		console.error(error);
		return Observable.throw(error || "Server Error");
		
	}

}
