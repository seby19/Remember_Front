import { Component , OnInit  , ElementRef, ViewChild} from '@angular/core';
import { SignUpService } from './signup.service';
import { FormGroup , FormControl , Validators , FormBuilder} from '@angular/forms';
import { LoginService } from '../login/login.service';
import { LoginData } from '../login/Login.data';
import { Router , ActivatedRoute  } from '@angular/router';
import { LoggedInCheckService } from '../logged-in-check.service';
import { JwttokenService } from '../jwttoken.service';
import { forkJoin } from "rxjs/observable/forkJoin";
import { JwtUserData } from '../JwtUserData';
import {StompService} from '@stomp/ng2-stompjs';

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
	marginTop = true;
	requestsMenuDesc : boolean = false;
	GroupMenuDesc : boolean = false;
	GroupMenu = false;
	@ViewChild('division1') division1: ElementRef;
	@ViewChild('division2') division2: ElementRef;

  constructor(public sign : SignUpService , private _signUpFormBuilder : FormBuilder , public _login : LoginService,
  				public router : Router , public route : ActivatedRoute , private userLog :LoggedInCheckService  ,
  				private jwttokenService  : JwttokenService , private stompService : StompService ){
		this.requestDropDown = false;
		this.marginTop = true;
		this.requestsMenuDesc  = false;
		this.GroupMenuDesc = false;
		this.GroupMenu = false;
  	
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

		if(localStorage.getItem('GroupId') != null)
		{ 
			this.showCreateGroup();
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

	showRequestsMenuDesc(){
		this.requestsMenuDesc = true;
	}

	hideRequestsMenuDesc(){
		this.requestsMenuDesc = false;
	}

	showGroupMenuDesc(){
		this.GroupMenuDesc = true;
	}

	hideGroupMenuDesc(){
		this.GroupMenuDesc = false;
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
				console.log(" data singup :" + data)  
				localStorage.setItem( 'Authorization' , 'Token ' +this.JwtToken);
				localStorage.setItem( 'username' ,this.signup.value.username_sign );
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
		console.log(" data singup 2 : " + this.loginSuccess )
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
		this.loginSuccess = 0;
		this.employees = [];
	  	this.search  = null;
	  	//this.router.navigate(['/'] );
		this.userLog.Logout();
		this.stompService.disconnect();

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
		if(this.search == null || !this.classId)
		{
			//console.log(" 1 this.search " + this.search + " this.classId " + this.classId )
			return false;
			
		}
		else if ( this.search == "")
		{
			//console.log(" 2 this.search " + this.search + " this.classId " + this.classId )
			return false;
			
		}
		//console.log(" 3 this.search " + this.search + " this.classId " + this.classId )
		//this.classId = true;
		return true;
	}
	showRequestDropDown()
	{
		this.hideRequestsMenuDesc();
		this.requestDropDown = !(this.requestDropDown);
	}
	hideRequestDropDown()
	{
		this.requestDropDown = false;
	}
	showCreateGroup(){
		this.GroupMenu = true;
		//this.division1.nativeElement.style.filter = 50%;
		//this.division2.nativeElement.style.filter = 50%;
	}
	hideCreateGroup(){
		this.GroupMenu = false;
		localStorage.removeItem('GroupId');
		//this.division1.nativeElement.style.opacity = 1;
		//this.division2.nativeElement.style.opacity = 1;
	}

	hidingFunc(){
		if(!(this.checkLogin()))
		{
			return true;
		}
		else
		{
			if(window.innerWidth< 900)
			{
				this.marginTop=  false;
				return false;
			}
			this.marginTop=  true;
			return true;
		}
	}
	closeEvent(value : number){
		if(value == 1)
		{
			this.hideCreateGroup();
		}
	}
}
