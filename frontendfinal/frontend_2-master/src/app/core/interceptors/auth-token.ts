import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { UserDetails } from "../services/user-details";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const user = inject(UserDetails)
    const token = user.getToken()

    if(token) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        return next(authReq)
    }
    return next(req)
}