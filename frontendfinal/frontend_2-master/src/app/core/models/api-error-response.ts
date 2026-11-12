export interface ApiErrorResponse {
  status: number;
  message: string;
  timestamp?: string;
  path?: string;
  errors?: string[];
}
