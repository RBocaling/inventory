export type userType = {
  user_id: string;
  user_role_id: number;
  role_id: number;
  role: string;
  status_id: number;
  description: string;
  created_at: string;
  updated_at: string;
  contact_no: string;
  first_name: string;
  last_name: string;
  is_oriented: number;
  designation:any
};

export type UserDataArray = userType[];
