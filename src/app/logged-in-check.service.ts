import { Injectable , OnInit} from '@angular/core';
import { Router , ActivatedRoute  } from '@angular/router';

@Injectable()
export class LoggedInCheckService implements OnInit {

  constructor(private router : Router){}
  ngOnInit(){}

  private token : string ;


  get isLoggedInState() : boolean
  { 
    if(localStorage.getItem( 'Authorization' ) && localStorage.getItem( 'username' ) )
    { 
      this.token = localStorage.getItem( 'Authorization' )
      if(this.token.substring(0,5) === "Token" && this.token.substring(6)){
        
        return true;

      }
    }
      return false ;	
  }

  Logout(){
    localStorage.removeItem( 'Authorization' );
    localStorage.removeItem( 'username' );
    localStorage.removeItem( 'GroupId' );
    this.router.navigate(['/'] );
  }
}
