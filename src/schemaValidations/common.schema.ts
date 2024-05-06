import * as Yup from 'yup';


export const MessageRes = Yup
  .object({
    message: Yup.string()
  })
  .strict()

export type MessageResType = Yup.InferType<typeof MessageRes>
