import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthReturnInterface } from './auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService) { }

  ngOnInit() { }

  onSubmit(authForm: NgForm): void {
    if(!authForm.valid) {
      return;
    }
    
    const email = authForm.value.email;
    const password = authForm.value.password;

    let authObservable: Observable<AuthReturnInterface>;

    this.isLoading = true;
    if(this.isLoginMode) {
      authObservable = this.authService.signIn(email, password);
    } else {
      authObservable = this.authService.signUp(email, password);
    }

    authObservable.subscribe(responseData => {
        console.log(responseData);
        this.isLoading = false;
      }, errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
    });

    authForm.reset();
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

}
