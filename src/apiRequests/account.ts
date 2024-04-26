import http from "@/lib/http";
import { userType } from "@/schemaValidations/account.schema";

const accountApiRequest = {
    get: (sessionToken: string) =>
      http.get<userType>('api/v1/product/get-all', {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      }),
  }


  export default accountApiRequest