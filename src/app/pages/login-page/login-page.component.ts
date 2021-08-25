import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit {
  userForm!:FormGroup;

  constructor(private userService : UserService, private router: Router) { }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    }); 
  }
  authenticateUser(){
    if (this.userForm.get('email')?.value === null || this.userForm.get('password')?.value === null ){
      alert("Please fill in all fields");
    }
    else{
      this.userService.authenticateUser(this.userForm.get('email')?.value, this.userForm.get('password')?.value).subscribe((response: any) =>{
      });
    }   
  }
  redirect(){
    this.router.navigate(['/register']);
  }
}
