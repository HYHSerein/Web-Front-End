export interface passwordForgetRequest{
    username: string;
    email: string;
    code: string;
}
export interface passwordForget{
    newPassword: string;
    checkPassword:string;
    code:string;
}