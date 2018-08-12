import { Component, OnInit } from '@angular/core';
import { GetfriendsService } from './getfriends.service';
import { HostListener } from "@angular/core";
import { LoggedInCheckService } from '../logged-in-check.service';
import { RequestsService } from "../requests/requests.service";
import { JwtUserData } from "../JwtUserData";

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
    socket1  = null;
    internalSocket = null;
  constructor(private requestsService : RequestsService , private friends : GetfriendsService ,  private userLog :LoggedInCheckService ) { 
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

      this.socket1  = this.requestsService.initializeWebSocketConnection().subscribe(async userData =>{
        await this.addToFriends_list1(JSON.parse(userData.body));
      },
      error => {this.errorMsg = error;
        this.friends_list = null;
        this.errorMsg = null;
        this.search  = null;
        this.classId  = false;
        this.columnView = true; 
        this.userLog.Logout();
        });
        
      this.internalSocket = this.friends.initializeWebSocketConnection().subscribe(async userData =>{
        await this.addToFriends_list(userData.body);
      },
      error => {this.errorMsg = error;
        this.friends_list = null;
        this.errorMsg = null;
        this.search  = null;
        this.classId  = false;
        this.columnView = true; 
        this.userLog.Logout();
        });

    

  }
  addToFriends_list1(data)
  { 
    this.friends_list.push(data);
  }
  addToFriends_list(data)
  { 
    console.log(data)
    var data1 = data.split(" ");
    let jwtUser = new JwtUserData(data1[0] , data1[1]);
    this.friends_list.push(jwtUser);
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
