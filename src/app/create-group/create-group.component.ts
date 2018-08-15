import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl , Validators , FormBuilder} from '@angular/forms';
import { CreateGroupService } from './create-group.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  createGroup = null;
  groupDataError = 0;
  constructor(  private createGroupForm : FormBuilder , private createGroupService : CreateGroupService) { 
    this.createGroup = null;
    
  }

  ngOnInit() {
    this.createGroup = this.createGroupForm.group({
      groupName : [null , Validators.required],
      groupDesc : [null , Validators.required]
    });
  }


  showGroupnameError(data)
  {
    this.groupDataError = data;
  }

  createGroups()
  {
      this.createGroupService.GroupGenerate(this.createGroup.value)
        .subscribe(async valid =>{
          await this.showGroupnameError(valid)
        } , grouperror => this.groupDataError = grouperror)
  }

  disableError()
  {
    this.groupDataError = 0;
  }
}
