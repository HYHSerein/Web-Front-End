export interface passwordForgetRequest{
    username: string;
    email: string;
    code: string;
}
export interface passwordForget{
    username:string;
    newPassword: string;
    checkPassword:string;
    code:string;
}