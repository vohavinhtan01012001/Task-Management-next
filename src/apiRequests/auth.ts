import http from "@/lib/http";
import { LoginBodyType, LoginResType, SignUpBodyType, SignUpResType } from '../schemaValidations/auth.schema';
import { MessageResType } from "@/schemaValidations/common.schema";


const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>('api/v1/authorization/login', body),
  auth: (sessionToken:string) =>
    http.post('/api/auth', sessionToken, {
      baseUrl: ''
    }),
  register: (body:SignUpBodyType) => http.post<SignUpResType>('api/v1/authorization/register', body),
  logoutFromNextClientToNextServer: (
    force?: boolean | undefined,
    signal?: AbortSignal | undefined
  ) =>
    http.post<MessageResType>(
      '/api/auth/logout',
      {
        force
      },
      {
        baseUrl: '',
        signal
      }
    ),
}

export default authApiRequest
