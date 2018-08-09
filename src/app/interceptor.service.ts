import { Injectable } from '@angular/core';
import { HttpInterceptor , HttpRequest , HttpHandler , HttpEvent} from '@angular/common/Http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class InterceptorService implements HttpInterceptor{

  constructor() { }

  intercept( req : HttpRequest<any> , next : HttpHandler) : Observable<HttpEvent<any>>  {
  	console.log("interceptor");	
  	if( localStorage.getItem('Authorization'))
  	{	
	  	const request = req.clone({
	  		headers : req.headers.set( 'Authorization'  , localStorage.getItem('Authorization'))});
	  	console.log(request);	
	  	return next.handle(request);
	 }
	 return next.handle(req);
  }
}
