import { Component, OnInit, Input } from '@angular/core';
import { PostsService } from './posts.service';
import { Params  , Router , ActivatedRoute } from '@angular/router';
import { GroupData } from '../GroupData';
import { LoggedInCheckService } from '../logged-in-check.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  ActivedGroup = null;
  errorMsg = null;
  posts  = null;
  @Input()
  set ActiveGroup(grp)
  {
    this.ActivedGroup = grp;
    this.getPosts();

  }
  constructor( private userLog : LoggedInCheckService , private router : Router ,private currentRoute : ActivatedRoute , private postsService : PostsService) {
      // this.currentRoute.queryParams.subscribe(params =>{
      //       this.saveGroup(params);
      //       console.log("this.activatedGroup posts home params " + JSON.stringify(params));
      //   })
      this.posts  = null;

   }


  
  ngOnInit() {

  }

  getPosts()
  {
    this.postsService.getPosts(this.ActivedGroup.Groupid).subscribe(async post_list => { await this.setPosts(post_list.json());
      localStorage.setItem( 'Authorization' , 'Token ' + post_list.headers.get("Authorization"));
    } , 
      error => {this.errorMsg = error;
      this.posts = [];
      this.errorMsg = null;
      this.userLog.Logout();
    });
  }

  setPosts(data)
  {
    this.posts = null;
    console.log("post dtd " + data[0].content);
    this.posts = data;
    console.log("post dtd " + this.posts[0].content);

  }

}
