import * as yup from 'yup'

export default yup.object().shape({
  name: yup
    .string()
    .min(3)
    .max(30)
    .required(),
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .min(6)
    .max(20)
    .required()
})
