import { Component, OnInit } from '@angular/core';
import { GetfriendsService } from './getfriends.service';
import { HostListener } from "@angular/core";
import { LoggedInCheckService } from '../logged-in-check.service';


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

	  friends_list = null;
  	errorMsg = null;
  	search :string = null;
  	classId : boolean = false;
    columnView :boolean = true;
  constructor(private friends : GetfriendsService ,  private userLog :LoggedInCheckService ) { 
  		this.friends_list = null;
  		this.errorMsg = null;
   }

  
  ngOnInit() {
  		this.friends_list = null;
  		this.errorMsg = null;
  		this.friends.getFriends().subscribe(async friend_list => { await this.setFriends_list(friend_list.json());
        localStorage.setItem( 'Authorization' , 'Token ' + friend_list.headers.get("Authorization"));
      } , 
  			error => {this.errorMsg = error;
        this.friends_list = null;
        this.errorMsg = null;
        this.search  = null;
        this.classId  = false;
        this.columnView = true;
        this.userLog.Logout();
      });
  }

  setFriends_list(data)
  {
  	this.friends_list = data;
  }
  toShow(name){
  	if(this.search == null || this.search == "")
  	{
  		return true;	
  	}
  	else if( this.search != ""){
  		if((name.toLowerCase()).includes(this.search.toLowerCase()))
  		{
  			return true;
  		}
  		return false;
  	}
  	
  }


  addClass()
  {
  	this.classId = (this.classId == true) ? false : true ;
  }

  @HostListener('window:resize', ['$event'])
      onResize(event?) {
      if(window.innerWidth >= 800)
      {
        this.columnView = true;  
      }
      else{
        this.columnView = false;    
      }
      
  }

}
