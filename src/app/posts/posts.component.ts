import { Component, OnInit, Input, ElementRef , ViewChild , AfterViewInit } from '@angular/core';
import { PostsService } from './posts.service';
import { Params  , Router , ActivatedRoute } from '@angular/router';
import { GroupData } from '../GroupData';
import { LoggedInCheckService } from '../logged-in-check.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit , AfterViewInit  {
  // GroupData object
  ActivedGroup = null; 
  errorMsg = null;
  posts  = null;
  postData = null;
  currentWebSocket = null;
  @ViewChild('reactivity') elementView: ElementRef;
  @ViewChild('reactivity2') elementView2: ElementRef;

  @Input()
  set ActiveGroup(grp)
  {
    this.ActivedGroup = grp;
    this.getPosts();

  }
  ngAfterViewInit(){
  }

  constructor( private userLog : LoggedInCheckService , private router : Router ,private currentRoute : ActivatedRoute , private postsService : PostsService) {
      // this.currentRoute.queryParams.subscribe(params =>{
      //       this.saveGroup(params);
      //       console.log("this.activatedGroup posts home params " + JSON.stringify(params));
      //   })
      this.posts  = null;

   }


  
  ngOnInit() {
    this.postData = null;


  }
  myPost(postUsr)
  {
    if(postUsr === localStorage.getItem("username") )
    {
      return true;
    }
    return false;
  }

  getPosts()
  {
    //console.log(this.ActivedGroup.Groupid + " grpid in osts")

    this.postsService.getPosts(this.ActivedGroup.Groupid).subscribe(async post_list => { await this.setPosts(post_list.json());
      localStorage.setItem( 'Authorization' , 'Token ' + post_list.headers.get("Authorization"));
    } , 
      error => {this.errorMsg = error;
      this.posts = [];
      this.errorMsg = null;
      this.userLog.Logout();
    });

    if(this.currentWebSocket != null)
    {
      this.currentWebSocket.unsubscribe();
    }

    this.currentWebSocket = this.postsService.initializeWebSocketConnection(this.ActivedGroup.Groupid).subscribe(async postData =>{
      await this.addPostToList(JSON.parse(postData.body));
    },
    error => {this.errorMsg = error;
      this.posts = [];
      this.errorMsg = null;
      this.userLog.Logout();
      });      
  }

  addPostToList(data)
  {
    this.postData = null;
    this.posts.push(data);
  }

  setPosts(data)
  {
    this.posts = null;
    //console.log("post dtd " + data[0].content);
    this.posts = data;
    //console.log("post dtd " + this.posts[0].content);

  }
  sendPost(event , ActivedGroup )
  {
    if(event.key === "Enter")
    {
      //console.log(event.key + " " + this.postData);
      if(this.postData != null && this.postData != "")
      {
        this.postsService.sendPost(this.postData , ActivedGroup.Groupid )     
      }
    }
  }

}
