import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { User } from './user.model';

export interface AuthReturnInterface {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient) { }

    signUp(email: string, password: string) {
        return this.http
            .post<AuthReturnInterface>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBsEH1saSF_BK3LuJrIAjf-ziFbk53hszY',
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            .pipe(
                catchError(errorResponse => this.errorHandler(errorResponse)), 
                tap(responseData => {
                    this.handleUser(responseData.email, responseData.idToken, responseData.localId, +responseData.expiresIn);
                }));
    }

    signIn(email: string, password: string) {
        return this.http
            .post<AuthReturnInterface>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBsEH1saSF_BK3LuJrIAjf-ziFbk53hszY',
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            .pipe(
                catchError(errorResponse => this.errorHandler(errorResponse)), 
                tap(responseData => {
                    this.handleUser(responseData.email, responseData.idToken, responseData.localId, +responseData.expiresIn);
                }));
    }

    private errorHandler(error: HttpErrorResponse): Observable<never> {
        let errorMessage = '';

        if(!error.error || !error.error.error) {
            return throwError(errorMessage);
        }

        switch(error.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'The email address is already in use by another account.';
                break;
            case 'OPERATION_NOT_ALLOWED':
                errorMessage = 'Password sign-in is disabled for this project.';
                break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'The password is invalid or the user does not have a password.';
                break;
            case 'USER_DISABLED':
                errorMessage = 'The user account has been disabled by an administrator.';
                break;
            default:
                errorMessage = 'An error occurred!';
                break;
        }
        console.log(error);
        return throwError(errorMessage);
    }

    private handleUser(email: string, token: string, userId: string, expiresIn: number): void {
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
        );
        const user = new User(
            email,
            userId,
            token, 
            expirationDate
        );
        this.user.next(user);
    }

}