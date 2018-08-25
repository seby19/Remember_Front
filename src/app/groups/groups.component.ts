import { Component, OnInit , Input , EventEmitter , Output } from '@angular/core';
import { GroupsService } from './groups.service';
import { LoggedInCheckService } from '../logged-in-check.service';
import { GroupData } from '../GroupData';
import { HostListener } from "@angular/core";
import { CreateGroupService } from "../create-group/create-group.service";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  @Output() GroupSelected = new EventEmitter<number>();

  
  groups_list = null;
  columnView = true;
  errorMsg = null;
  constructor( private createGroupService  : CreateGroupService ,private groupService : GroupsService , private userLog : LoggedInCheckService) { 
    this.groups_list = null;
    this.columnView = true;

  }

  
  ngOnInit() {

    this.groupService.internalIntializeWebSocket().subscribe(async grpData =>{
      await this.addToGroups_list(grpData.body);
    },
    error => {this.errorMsg = error;
      this.groups_list = [];
      this.errorMsg = null;
      this.userLog.Logout();
      });

    this.groupService.getGroups().subscribe(async group_list => { await this.setGroups_list(group_list.json());
      localStorage.setItem( 'Authorization' , 'Token ' + group_list.headers.get("Authorization"));
    } , 
      error => {this.errorMsg = error;
      this.groups_list = [];
      this.errorMsg = null;
      this.userLog.Logout();
    });

    this.createGroupService.initializeWebSocketConnection().subscribe(async userData =>{
      await this.addToGroups_list2(JSON.parse(userData.body));
    },
    error => {this.errorMsg = error;
      this.groups_list = [];
      this.errorMsg = null;
      this.userLog.Logout();
      });

  }

  addToGroups_list(data)
  { 
    var data1 = data.split(" ");
    let grp = new GroupData(data1[3] , data1[0],  data1[2] , data1[1] );
    this.groups_list.push(grp);
  }

  addToGroups_list2(data)
  { 
    //var data1 = data.split(" ");
    //let jwtUser = new JwtUserData(data1[0] , data1[1]);
    this.groups_list.push(data);
  }

  setGroups_list(data)
  {
    this.groups_list = data;
    //let grp = new GroupData(data[0].groupName , data[0].id ,  data[0].adminId , data[0].groupDesc );
    //this.groups_list.push(grp);
  }

  showGroup(grp)
  {
    console.log("showGroup" + grp.groupName);
    this.GroupSelected.emit(grp);
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
