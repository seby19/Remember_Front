import { Component, OnInit } from '@angular/core';
import { ConnectPeopleService } from './connect-people.service';
import { HostListener  , Input} from "@angular/core";
import { LoggedInCheckService } from '../logged-in-check.service';
import { ElementRef, ViewChild } from '@angular/core';
import { async } from '../../../node_modules/@types/q';

@Component({
  selector: 'app-connect-people',
  templateUrl: './connect-people.component.html',
  styleUrls: ['./connect-people.component.css']
})
export class ConnectPeopleComponent implements OnInit {
	
  peoples_list = null;
  errorMsg = null;
  search_string :string = null;
  classId : boolean = false;
  columnView :boolean = true;
  superSmall : boolean = false;
  colorInvert : boolean = false;
  socket1  = null;
  logoutKeeper1 : number = 1  ;
  @ViewChild('reactivity') elementView: ElementRef;
  @Input() empName : string;
  
  @Input() 
  set logoutKeeper(logoutKeeper : number)
  {
    this.logoutKeeper1  = logoutKeeper;
    console.log(" in logoutKeeper" + this.logoutKeeper1);
    if(this.logoutKeeper1 == 0)
    {
      console.log(" socket unsubscribed");
      this.socket1.unsubscribe();
    }
  }

  constructor(private peopleService : ConnectPeopleService ,  private userLog :LoggedInCheckService ) { 
      this.peoples_list = null;
      this.errorMsg = null;
      this.search_string  = null;
      this.classId  = false;
      this.columnView = true;
      this.superSmall  = false;
      this.empName  = null;
      this.logoutKeeper = 1;
  }



  ngOnInit() {
    this.logoutKeeper = 1;
  	this.peoples_list = null;
  		this.errorMsg = null;
  		this.peopleService.getPeople().subscribe(async people_list => { 
  		await this.setPeople_list(people_list.json());
		localStorage.setItem( 'Authorization' , 'Token ' + people_list.headers.get("Authorization"));
      } , 
  			error => {this.errorMsg = error
        this.peoples_list = null;
        this.errorMsg = null;
        this.search_string  = null;
        this.classId  = false;
        this.columnView = true;
        this.superSmall  = false;
        this.empName  = null;  
  			this.userLog.Logout();
        });
        
      this.socket1 = this.peopleService.initializeWebSocketConnection().subscribe(async userData =>{
          await this.removeToPeple_list(JSON.parse(userData.body));
        },
        error => {this.errorMsg = error
          this.peoples_list = null;
          this.errorMsg = null;
          this.search_string  = null;
          this.classId  = false;
          this.columnView = true;
          this.superSmall  = false;
          this.empName  = null;  
          this.userLog.Logout();
          });       
    this.onResize(null);

    
  }

  removeToPeple_list(data){
    console.log(this.peoples_list.indexOf(data) + " index ");
    console.log(data + " data ");
    console.log(this.peoples_list + " this.peoples_list ");
    this.peoples_list.splice(this.peoples_list.indexOf(data) , 1);
    if(this.peoples_list.indexOf(data) < 0)
    { 
      for(var i =0 ; i < this.peoples_list.length ; i++)
      {
        if(data.id ===this.peoples_list[i].id )
        { 
          console.log(this.peoples_list[i].username + " username " + this.peoples_list[i].id + " id ");
        }
      }
      this.peoples_list.splice(i , 1);
    }
  }
  setPeople_list(data){
  	this.peoples_list = data; 
  }
	
	@HostListener('window:resize', ['$event'])
	    onResize(event?) {

	    if(window.innerWidth >= 1000)
	    {
	    	this.columnView = true;	
	    }
	    else{
	    	this.columnView = false;		
	    }
	    
      if(this.elementView.nativeElement.offsetWidth <= 335)
      {
        this.columnView = false;
        this.superSmall = true;
        if(((window.innerWidth - this.elementView.nativeElement.offsetWidth ) <= 100) && ((this.empName == null) || (this.empName == "") ))
        {
          this.colorInvert = false
        }
        else
        {
          this.colorInvert = true;
        }
      }
      else{
        if(((this.empName == null) || (this.empName == "") ))
        {
          this.colorInvert = false
        }
        else{
          this.colorInvert = true
        }
        this.superSmall = false;
      }
	}

  showEmp(username){

    if(this.empName == null || this.empName === "")
    {
       return true ; 
    }
    else if((username.toLowerCase()).includes(this.empName.toLowerCase()))
    {
       return true;
    }
    return false;
  }

  addConnection(ppl){
    this.removeToPeple_list(ppl);
    //this.peoples_list.splice(this.peoples_list.indexOf(ppl) , 1);
    this.peopleService.sendConnect(ppl);
  }
}
