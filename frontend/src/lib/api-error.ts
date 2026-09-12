import type { ApiErrorResponse } from "@/components/form/types";

export class ApiRequestError extends Error {
  status: number;
  data: ApiErrorResponse;

  constructor(status: number, data: ApiErrorResponse) {
    super(data.message);
    this.name = "ApiRequestError";
    this.status = status;
    this.data = data;
  }
}
