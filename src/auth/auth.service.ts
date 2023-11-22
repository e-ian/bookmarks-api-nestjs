import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
// handles the business logic for auth

    signup() {
        return 'I have signed up'
    }

    signin() {
        return 'I have signed in'
    }
}
