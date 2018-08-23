import { Component, OnInit , Input ,  EventEmitter , Output} from '@angular/core';
import { FormGroup , FormControl , Validators , FormBuilder} from '@angular/forms';
import { CreateGroupService } from './create-group.service';
import { GetfriendsService } from '../friends/getfriends.service';
import { LoggedInCheckService } from '../logged-in-check.service';
import { JwtUserData } from "../JwtUserData";
import { GroupData } from '../GroupData';
import { RequestsService } from "../requests/requests.service";


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  createGroup = null;
  groupId : string = null;
  logoutKeeper1 = null;
  groupDataError = null;
  peoples_list = null;
  errorMsg = null;
  columnView = false;
  socket1 = null;
  search : string = null;

  @Output() outputDoneToHome = new EventEmitter<number>();


  @Input() 
  set logoutKeeper(logoutKeeper : number)
  {
    this.logoutKeeper1  = logoutKeeper;
    //console.log(" in logoutKeeper" + this.logoutKeeper1);
    if(this.logoutKeeper1 == 0)
    {
      //console.log(" socket unsubscribed");
      //this.socket1.unsubscribe();
    }
  }
  constructor( private requestsService : RequestsService , private userLog :LoggedInCheckService  , private friends : GetfriendsService  , private createGroupForm : FormBuilder , private createGroupService : CreateGroupService) { 
    this.createGroup = null;
    
  }

  ngOnInit() {

    this.search  = null;

    this.createGroup = this.createGroupForm.group({
      groupName : [null , Validators.required],
      groupDesc : [null , Validators.required]
    });

    this.socket1  = this.requestsService.initializeWebSocketConnection().subscribe(async userData =>{
      await this.addToFriends_list(JSON.parse(userData.body));
    },
    error => {this.errorMsg = error;
      this.peoples_list = null;
      this.errorMsg = null;
      this.columnView = true;
      this.userLog.Logout();
      });


    if(!this.showScreen()){
      this.createGroupService.getFriendsToAdd( localStorage.getItem('GroupId')).subscribe(async friend_list => { await this.setFriends_list(friend_list.json());
        localStorage.setItem( 'Authorization' , 'Token ' + friend_list.headers.get("Authorization"));
      } , 
        error => {this.errorMsg = error;
        this.peoples_list = null;
        this.errorMsg = null;
        this.columnView = true;
        this.userLog.Logout();
      });
    }else{
      this.friends.getFriends().subscribe(async friend_list => { await this.setFriends_list(friend_list.json());
        localStorage.setItem( 'Authorization' , 'Token ' + friend_list.headers.get("Authorization"));
      } , 
        error => {this.errorMsg = error;
        this.peoples_list = null;
        this.errorMsg = null;
        this.columnView = true;
        this.userLog.Logout();
      });
    }

    
  }

  showEmp(name){
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
  addToFriends_list(data)
  { 
    //var data1 = data.split(" ");
    //let jwtUser = new JwtUserData(data1[0] , data1[1]);
    this.peoples_list.push(data);
  }

  setFriends_list(data)
  {
  	this.peoples_list = data;
  }

  setGroupId(group)
  {
    this.groupId = group.id; // Emit an event with this as parameter to groups component
    localStorage.setItem('GroupId' , this.groupId);
    // this.createGroupService.getFriendsToAdd( localStorage.getItem('GroupId')).subscribe(async friend_list => { await this.setFriends_list(friend_list.json());
    //   localStorage.setItem( 'Authorization' , 'Token ' + friend_list.headers.get("Authorization"));
    // } , 
    //   error => {this.errorMsg = error;
    //   this.peoples_list = null;
    //   this.errorMsg = null;
    //   this.columnView = true;
    //   this.userLog.Logout();
    // });
  }

  createGroups()
  {
      this.createGroupService.GroupGenerate(this.createGroup.value)
        .subscribe(async group =>{
          await this.setGroupId(group)
        } , grouperror => this.groupDataError = grouperror)
  }

  disableError()
  {
    this.groupDataError = null;
  }

  showScreen()
  {
    if(localStorage.getItem('GroupId') != null)
    {
      return false;

    }
    return true;
  }

  checkFriendsList(){
    if(this.peoples_list != ""  )
    {
      return true;
    }
    return false;
  }

  addPerson(ppl){
    this.peoples_list.splice(this.peoples_list.indexOf(ppl) , 1);
    this.createGroupService.addPerson(ppl , localStorage.getItem('GroupId') );
  }

  closeView(){
    this.outputDoneToHome.emit(1);
  }
}
