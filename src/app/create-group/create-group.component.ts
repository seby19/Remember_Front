import { Component, OnInit , Input} from '@angular/core';
import { FormGroup , FormControl , Validators , FormBuilder} from '@angular/forms';
import { CreateGroupService } from './create-group.service';
import { GetfriendsService } from '../friends/getfriends.service';
import { LoggedInCheckService } from '../logged-in-check.service';
import { JwtUserData } from "../JwtUserData";



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
  constructor(  private userLog :LoggedInCheckService  , private friends : GetfriendsService  , private createGroupForm : FormBuilder , private createGroupService : CreateGroupService) { 
    this.createGroup = null;
    
  }

  ngOnInit() {
    this.createGroup = this.createGroupForm.group({
      groupName : [null , Validators.required],
      groupDesc : [null , Validators.required]
    });

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

  setFriends_list(data)
  {
  	this.peoples_list = data;
  }

  setGroupId(data)
  {
    this.groupId = data;
    localStorage.setItem('GroupId' , this.groupId);
  }

  createGroups()
  {
      this.createGroupService.GroupGenerate(this.createGroup.value)
        .subscribe(async Id =>{
          await this.setGroupId(Id)
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
      console.log("truefalse showscreen");
      return false;
    }
    console.log("true showscreen");
    return true;
  }

  checkFriendsList(){
    if(this.peoples_list[0])
    {
      console.log( " peoples list " + this.peoples_list[0])
      console.log("true checkfriends");
      return true;
    }
    console.log("false checkfriends");
    return false;
  }
}
