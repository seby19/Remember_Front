import { Component, OnInit , Input , Output , EventEmitter} from '@angular/core';
import { Params  } from '@angular/router';
import { LoggedInCheckService } from '../logged-in-check.service'; 
import { StompService } from '@stomp/ng2-stompjs'
import { GroupData } from '../GroupData';
import { Router , ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-login-home',
  templateUrl: './login-home.component.html',
  styleUrls: ['./login-home.component.css']
})
export class LoginHomeComponent implements OnInit {
  user_id : string = null;
  activatedGroup = null;
  groupData = new GroupData(null,null,null,null);

  constructor( private router : Router ,private currentRoute : ActivatedRoute , user : LoggedInCheckService , private stompService : StompService) { 
    // this.currentRoute.queryParams.subscribe(params =>{
    //   this.groupList = params;
    // })
  }

  ngOnInit() {

        this.stompService.initAndConnect();
  	/*this.currentRoute.params.subscribe((params : Params) =>
  			{
  				this.user_id = parseInt(params['user_id']);
  			});*/
        this.user_id = localStorage.getItem( 'Authorization' );
  }

  showPosts()
  {
    if(this.activatedGroup != "" && this.activatedGroup != null)
    {
      return true;
    }
    return false;
  }
  sendInput(grp)
  {
    this.groupData = new GroupData(grp.groupName , grp.id ,
                                   grp.adminId , grp.groupDesc );
    this.activatedGroup = (this.groupData);
    //this.router.navigate(['/posts'] , this.activatedGroup);
    console.log("this.activatedGroup login home " + this.activatedGroup.Adminid);
  }

}
