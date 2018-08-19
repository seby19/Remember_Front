import { Component, OnInit , Input} from '@angular/core';
import { FormGroup , FormControl , Validators , FormBuilder} from '@angular/forms';
import { CreateGroupService } from './create-group.service';

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
  constructor(  private createGroupForm : FormBuilder , private createGroupService : CreateGroupService) { 
    this.createGroup = null;
    
  }

  ngOnInit() {
    this.createGroup = this.createGroupForm.group({
      groupName : [null , Validators.required],
      groupDesc : [null , Validators.required]
    });
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
      return false;
    }
    return true;
  }
}
