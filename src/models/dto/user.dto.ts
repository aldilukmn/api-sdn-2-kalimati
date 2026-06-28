export default interface UserRequest {
  username: string;
  password: string;
  role: string;
  grade: string;
  nip: string;
  fullName: string;
  title: string;
  image_url?: string;
  image_id?: string
};