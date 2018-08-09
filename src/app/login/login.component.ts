import { Component, OnInit , EventEmitter , Output} from '@angular/core';
import { FormGroup , FormControl , Validators , FormBuilder} from '@angular/forms';
import { LoginService } from './login.service';
import { JwttokenService } from '../jwttoken.service';
import { forkJoin } from "rxjs/observable/forkJoin";
import { JwtUserData } from '../JwtUserData';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	
  loginSuccess : number = 0;
  errorMsg : string;
  JwtToken : string = null;

  @Output() outputLoginIdToHome = new EventEmitter<number>();
 
  constructor(private _loginFormBuilder : FormBuilder , private _login : LoginService , private jwttokenService  : JwttokenService
               ) { }

  loginForm = null;
 
  ngOnInit() {
  	this.loginForm = this._loginFormBuilder.group({
  		username : [ null, Validators.required],
  		password : [ null , Validators.required]
  	});

  }

  loginCheck()
  {
  	//console.log( this.loginForm.value ) ;
  /*
    forkJoin(this.jwttokenService.getToken(this.loginForm.value) , this._login.getLogin(this.loginForm.value)).
            subscribe(async loginData => {
                        await this.setJwtToken(loginData[0]);
                        await this.setloginSuccess(loginData[1]);
                        localStorage.setItem( 'Authorization' , 'Token ' +this.JwtToken);
                        this.outputLoginIdToHome.emit(this.loginSuccess);
            },
            error => this.errorMsg = error);
  */

    forkJoin(  this._login.getLogin(this.loginForm.value)).
                    subscribe(async loginDataservice => {
                            await this.setloginSuccess(loginDataservice[0]);
                    },
                    error => this.errorMsg = error);

    //this.jwttokenService.getToken(this.loginForm.value).subscribe(token => this.JwtToken = token ,
    //                                  tokenError => this.errorMsg = tokenError);

    

    //localStorage.setItem( 'Authorization' , 'Token ' +this.JwtToken);

  	//this._login.getLogin(this.loginForm.value).subscribe(loginData => this.loginSuccess = loginData/*.push(loginData)*/ ,
		//											loginError => this.errorMsg = loginError );
   
  	//this.outputLoginIdToHome.emit(this.loginSuccess);

  }
  setJwtToken(data){
    
    this.JwtToken = data;
  }
  setloginSuccess(data){

    this.loginSuccess = data;
    if(data  > 0)
    {
      let jwtUser = new JwtUserData(this.loginForm.value.username , this.loginSuccess);

      this.jwttokenService.getToken(jwtUser).subscribe(async jwtDataService =>{
          await this.setJwtToken(jwtDataService);
          localStorage.setItem( 'Authorization' , 'Token ' +this.JwtToken);
          localStorage.setItem( 'username' , this.loginForm.value.username);
          this.outputLoginIdToHome.emit(this.loginSuccess);
        },
        error => this.errorMsg = error);
    }
  }



  disableError()
  {
  	this.loginSuccess = 0;
  }

}
