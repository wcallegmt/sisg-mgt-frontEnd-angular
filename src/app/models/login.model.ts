export class LoginModel {
    userName: string;
    userPassword: string;
    rememberMe: boolean;
    constructor() {
        this.userName = '';
        this.userPassword = '';
        this.rememberMe = false;
    }
}
