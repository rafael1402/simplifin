import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AutenticacaoService } from "../autenticacao.service";
import { Subscription } from "rxjs";
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: "app-dashboard",
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  constructor(
    private autenticacaoService: AutenticacaoService,
    private authService: SocialAuthService
  ) {}

  isLoading = false;
  private loginSub: Subscription;

  ngOnInit() {
    this.loginSub = this.autenticacaoService
      .getAuthStatusListener()
      .subscribe((authStatu) => {
        this.isLoading = false;
      });

    this.authService.authState.subscribe((user) => {
      if (user) {
        this.isLoading = true;
        this.autenticacaoService.socialLogin(user);
      }
    });
  }

  ngOnDestroy() {
    this.loginSub.unsubscribe();
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  login(form: NgForm) {
    if (!form) {
      return;
    }

    this.isLoading = true;
    this.autenticacaoService.login(form.value.email, form.value.senha);
  }
}
