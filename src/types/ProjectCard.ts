export interface ProjectCardProps {
  id?: number;
  project_name: string;
  short_description: string;
  image_url: string;
  join_date: string;
  location: string;
  tags: string[] | null;
  min_investment: number;
  total_investor: number;
  total_raise: number;
}
