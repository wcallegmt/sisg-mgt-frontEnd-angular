export class UserModel {

    nameUser: string;
    passwordUser: string;
    repeatPassword: string;
    statusRegister: boolean;
    role: string;

    constructor() {

        this.nameUser = '';
        this.passwordUser = '';
        this.repeatPassword = '';
        this.statusRegister = true;
        this.role = '';
    }
}
