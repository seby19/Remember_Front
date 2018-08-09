import { Component , OnInit} from '@angular/core';
import { SignUpService } from './signup.service';
import { FormGroup , FormControl , Validators , FormBuilder} from '@angular/forms';
import { LoginService } from '../login/login.service';
import { LoginData } from '../login/Login.data';
import { Router , ActivatedRoute  } from '@angular/router';
import { LoggedInCheckService } from '../logged-in-check.service';
import { JwttokenService } from '../jwttoken.service';
import { forkJoin } from "rxjs/observable/forkJoin";
import { JwtUserData } from '../JwtUserData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
	employees = [];
  	errorMsg : string = null
  	signup = null;
  	signupdone : number = 0;
  	signupdataerror = null;
  	loginSuccess : number = 0;
  	JwtToken : string = null;
  	classId : boolean = false;
	search : string = null;
	requestDropDown = false;  
  constructor(public sign : SignUpService , private _signUpFormBuilder : FormBuilder , public _login : LoginService,
  				public router : Router , public route : ActivatedRoute , private userLog :LoggedInCheckService  ,
  				private jwttokenService  : JwttokenService ){
  	
  	
  }
	ngOnInit()
	{
		this.employees = [];
	  	this.errorMsg  = null
	  	this.signup = null;
	  	this.signupdone  = 0;
	  	this.signupdataerror = null;
	  	this.loginSuccess  = 0;
	  	this.JwtToken  = null;
	  	this.classId  = false;
		this.search  = null;
		this.requestDropDown = false;  
		this.signup = this._signUpFormBuilder.group({
			email : [null , Validators.required ],
			username_sign : [null , Validators.required ],
			password_sign : [null , Validators.required ]
		});

		
    	if(this.checkLogin())
    	{
      
     		this.changedValueFromLogin(1)
		}
		else
		{
			this.Logout();
		}
		
	}
	SignUp()
	{
			//console.log("in sign up");
			this.sign.signUp(this.signup.value).subscribe(async signupdata => {
													await this.setsignupdone(signupdata);
													this.signupdoneCheck(this.signupdone);
												},	
												signuperror => this.signupdataerror = signuperror );
	}
	setsignupdone(data)
	{
		this.signupdone = data;
	}
	signupdoneCheck(data){
		if (data == 1) {
				

				let loginData = new LoginData(this.signup.value.username_sign , this.signup.value.password_sign);
				
				forkJoin(  this._login.getLogin(loginData)).
            				subscribe(async loginDataservice => {
                        		await this.setloginSuccess(loginDataservice[0]);
				            },
				            error => this.errorMsg = error);
			}
	}
	
	setJwtToken(data){
    
	  this.JwtToken = data;
	}
	setloginSuccess(data){

	  this.loginSuccess = data;
	  if (data > 0 )
	  {
		  let jwtUser = new JwtUserData(this.signup.value.username_sign , this.loginSuccess);

		  this.jwttokenService.getToken(jwtUser).subscribe(async jwtDataService =>{
		  		await this.setJwtToken(jwtDataService);
				localStorage.setItem( 'Authorization' , 'Token ' +this.JwtToken);
	            this.changedValueFromLogin(this.loginSuccess );
			  },
			  error => this.errorMsg = error);
	  }

	}

	disableError()
	{
		this.signupdone = 0;
	}
	changedValueFromLogin(loginSuccess : number)
	{
		this.loginSuccess = loginSuccess;
		//this.userLog.setisLoggedIn();
		this.router.navigate(['/login'] );
	}
	checkLogin() : boolean
	{
		//console.log(this.userLog.isLoggedInState);
		if(this.loginSuccess == 1 && !this.userLog.isLoggedInState)
		{
			this.Logout();
		}

		return this.userLog.isLoggedInState;
	}


	Logout(){
		//localStorage.removeItem( 'Authorization' );
		//localStorage.removeItem( 'username' );
		this.employees = [];
	  	this.search  = null;
	  	this.loginSuccess = 0;
		//this.router.navigate(['/'] );
		this.userLog.Logout();
	}

	addClassOnFocus()
	  {
	  	this.classId =  true ;
	  }

	  removeClassOnOutsideClick()
	  {
	  	this.classId =  false ;
	  }

	showDropDown()
	{
		if(this.search == null  || !this.classId)
		{
			return false;
		}
		else if ( this.search == "")
		{
			return false;
		}
		return true;
	}
	showRequestDropDown()
	{
		this.requestDropDown = !(this.requestDropDown);
	}
	hideRequestDropDown()
	{
		this.requestDropDown = false;
	}
}