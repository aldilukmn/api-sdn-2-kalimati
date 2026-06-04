import ResponseType from "./type";

const defaultResponse = (
  code: number,
  response: 'success' | 'fail',
  message: string,
  result?: any
): ResponseType => {
  return {
    status: {
      code,
      response,
      message,
    },
    result
  }
};

export default defaultResponse;