import * as yup from 'yup'

export default yup.object().shape({
  title: yup
    .string()
    .min(5)
    .max(40)
    .required(),
  content: yup
    .string()
    .min(20)
    .required()
})
