export interface Membership {
  id: string;
  user_id: string;
  role: string;
  organizations: {
    id: string;
    name: string;
    slug: string;
  };
}