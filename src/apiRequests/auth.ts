import http from "@/lib/http";
import { LoginBodyType, LoginResType, SignUpBodyType, SignUpResType } from '../schemaValidations/auth.schema';


const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>('api/v1/authorization/login', body),
  auth: (sessionToken:string) =>
    http.post('/api/auth', sessionToken, {
      baseUrl: ''
    }),
  register: (body:SignUpBodyType) => http.post<SignUpResType>('api/v1/authorization/register', body),
}

export default authApiRequest
