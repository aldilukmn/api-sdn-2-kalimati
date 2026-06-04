const validateToken = (token: string | undefined) => {
  if (!token) {
    throw new Error('please login first!');
  };

  if (!token.startsWith('Bearer')) {
    throw new Error('wrong format token!')
  };

  const getToken: string = token.split(' ')[1];
  
  return getToken;
};

export default validateToken;