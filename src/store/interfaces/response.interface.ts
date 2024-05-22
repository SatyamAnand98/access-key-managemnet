export interface IResponse {
  data: Object;
  message: string;
  status?: number;
  metadata: {
    total?: number;
    page?: number;
    limit?: number;
    error: boolean;
  };
}
