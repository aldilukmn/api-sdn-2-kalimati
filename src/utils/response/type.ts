export default interface ResponseType {
  status: {
    code: number,
    response: string,
    message: string,
  };
  result?: any;
}