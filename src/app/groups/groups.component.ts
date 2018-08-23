import { Component, OnInit } from '@angular/core';
import { GroupsService } from './groups.service';
import { LoggedInCheckService } from '../logged-in-check.service';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  groups_list = null;
  errorMsg = null;
  constructor( private groupService : GroupsService , private userLog : LoggedInCheckService) { 
    this.groups_list = null;
  }

  
  ngOnInit() {
    this.groupService.getGroups().subscribe(async group_list => { await this.setGroups_list(group_list.json());
      localStorage.setItem( 'Authorization' , 'Token ' + group_list.headers.get("Authorization"));
    } , 
      error => {this.errorMsg = error;
      this.groups_list = null;
      this.errorMsg = null;
      this.userLog.Logout();
    });
  }

  setGroups_list(data)
  {
    this.groups_list = data;
    //console.log(this.groups_list.)
  }


}
