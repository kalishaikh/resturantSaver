import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { constants } from 'src/assets/constants/constants';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  userForm!: FormGroup;
  errorMsg!: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      'name' : new FormControl('',{
        validators: [Validators.required]
      }),
      'email' : new FormControl('', { 
        validators: [Validators.required, Validators.email],
      }),
      'password': new FormControl('',[Validators.required])
    }); 
  }

  cleanInput(){
    this.errorMsg = '';
  }

   registerUser(){
    this.errorMsg = null;
    let email = this.userForm.get('email')?.value; 
    let password = this.userForm.get('password')?.value;
    let name = this.userForm.get('name')?.value;
    
    if (email == '' || password == '' ){
      this.errorMsg = constants.EMPTY_FIELD_ERROR;
    }

    else{
      this.userService.registerUser(email, password, name).subscribe((response: any) =>{
        if(response == constants.USER_ALREADY_EXISTS){
          this.errorMsg = "User already exists in database";
        }
      });
    }
  }
}

