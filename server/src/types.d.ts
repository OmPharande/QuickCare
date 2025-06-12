export interface Patient {
  _id?: string;
  name: string;
  email: string;
  password: string;
  type?: 'patient';
}
