export default interface IUser {
  login: string;
  password: string;
  email: string;
  confirmed: boolean;
  canEdit: boolean;
  canDelete: boolean;
}
