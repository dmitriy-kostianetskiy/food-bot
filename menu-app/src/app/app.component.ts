import { AfterViewInit, Component, Inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  confirmationResult: firebase.auth.ConfirmationResult;

  phoneNumber: string = '+1 650-555-3434';
  verificationCode: string;

  constructor(
    @Inject(FirebaseApp) private firebaseApp: FirebaseApp & firebase.app.App,
    public auth: AngularFireAuth
  ) { }

  ngAfterViewInit(): void {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      size: 'invisible',
      callback: () => {
        this.login();
      }
    }, this.firebaseApp);
  }

  login(): void {
    this.loginAsync(this.phoneNumber);
  }

  logout(): void {
    this.auth.signOut();
  }

  linkWithGoogle(): void {
    this.linkWithGoogleAsync();
  }

  verifyCode(): void {
    this.verifyCodeAsync(this.verificationCode);
  }

  private async loginAsync(phoneNumber: string): Promise<void> {
    try {
      this.confirmationResult = await this.auth.signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier);

    } catch (error) {
      console.log(error);
      // TODO: handle error
    }
  }

  private async verifyCodeAsync(verificationCode: string): Promise<void> {
    try {
      await this.confirmationResult.confirm(verificationCode);
    } catch (error) {
      console.log(error);
      // TODO: handle error
    }
  }

  private async linkWithGoogleAsync(): Promise<void> {
    try {
      const user = await this.auth.currentUser;
      await user.linkWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (error) {
      console.log(error);
      // TODO: handle error
    }
  }
}
