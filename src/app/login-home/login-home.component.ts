import { Component, OnInit } from '@angular/core';
import { Params  , ActivatedRoute} from '@angular/router';
import { LoggedInCheckService } from '../logged-in-check.service'; 

@Component({
  selector: 'app-login-home',
  templateUrl: './login-home.component.html',
  styleUrls: ['./login-home.component.css']
})
export class LoginHomeComponent implements OnInit {
	user_id : string = null;

  constructor(private currentRoute : ActivatedRoute , user : LoggedInCheckService) { }

  ngOnInit() {

  	/*this.currentRoute.params.subscribe((params : Params) =>
  			{
  				this.user_id = parseInt(params['user_id']);
  			});*/
        this.user_id = localStorage.getItem( 'Authorization' );
  }

}
