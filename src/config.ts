import * as Yup from 'yup';

const configSchema = Yup.object().shape({
  NEXT_PUBLIC_API_ENDPOINT: Yup.string(),
  NEXT_PUBLIC_URL: Yup.string()
});

const envConfig = {
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL
};

configSchema.validate(envConfig)
  .then(valid => {
    console.log(valid); // valid object
    return valid;
  })
  .catch(error => {
    console.error(error.errors);
    throw new Error('Các giá trị khai báo trong file .env không hợp lệ');
  });

export default envConfig; 
