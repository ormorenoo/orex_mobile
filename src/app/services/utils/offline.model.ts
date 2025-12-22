export interface SaveResult {
  success: boolean;
  id?: string | number;
  mode?: 'ONLINE' | 'OFFLINE';
  message?: string;
  error?: any;
}
