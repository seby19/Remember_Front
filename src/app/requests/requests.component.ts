import { Component, OnInit } from '@angular/core';
import { RequestsService } from "./requests.service";
import { HostListener  , Input} from "@angular/core";
import { LoggedInCheckService } from '../logged-in-check.service';
import { ElementRef, ViewChild } from '@angular/core';
import { ConnectPeopleService } from "../connect-people/connect-people.service";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  peoples_list = null;
  errorMsg = null;
  search_string :string = null;
  classId : boolean = false;
  columnView :boolean = true;
  superSmall : boolean = false;
  colorInvert : boolean = false;
  socket1 = null;
  @ViewChild('reactivity') elementView: ElementRef;

  constructor(private requestsService : RequestsService ,  private userLog :LoggedInCheckService ,
              private connectPeopleService : ConnectPeopleService ) { 
      this.peoples_list = null;
      this.errorMsg = null;
      this.search_string  = null;
      this.classId  = false;
      this.columnView = true;
      this.superSmall  = false;
      this.socket1 = null;
  }



  ngOnInit() {

  	this.peoples_list = null;
  		this.errorMsg = null;
  		this.requestsService.getRequests().subscribe(async people_list => { 
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
  			this.userLog.Logout();
  			});

      this.onResize(null);

      this.socket1 = null;

      this.socket1 = this.connectPeopleService.initializeWebSocketConnection().subscribe(async userData =>{
        await this.addToPeople_list(JSON.parse(userData.body));
      },
      error => {this.errorMsg = error
        this.peoples_list = null;
        this.errorMsg = null;
        this.search_string  = null;
        this.classId  = false;
        this.columnView = true;
        this.superSmall  = false;
  			this.userLog.Logout();
        });

      this.requestsService.initializeWebSocketConnection();
  }

  addToPeople_list(data)
  {
    this.peoples_list.push(data);
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
        if((window.innerWidth - this.elementView.nativeElement.offsetWidth ) <= 20)
        {
          this.colorInvert = false
        }
        else
        {
          this.colorInvert = true;
        }
      }
      else{
        this.colorInvert = false
        this.superSmall = false;
      }
      console.log(this.elementView.nativeElement.parentElement.innerWidth + "seby Parent")
	}


  acceptConnection(ppl){
    this.peoples_list.splice(this.peoples_list.indexOf(ppl) , 1);
    this.requestsService.editConnection(ppl , 1);
  }

  rejectConnection(ppl){
    this.peoples_list.splice(this.peoples_list.indexOf(ppl) , 1);
    this.requestsService.editConnection(ppl , 2);
  }
}



