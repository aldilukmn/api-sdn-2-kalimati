export default interface UserRequest {
  username: string;
  password: string;
  role?: string;
  grade?: string;
  image_url?: string;
  image_id?: string
};