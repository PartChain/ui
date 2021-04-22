/**
 *
 *
 * @export
 * @interface Export
 */
export interface Export {
  buffer: number[];
  fileName: string;
  reportType: string;
}

/**
 *
 *
 * @export
 * @interface ExportResponse
 */
export interface ExportResponse {
  data: {
    response: {
      data: number[];
      type: string;
    };
  };
  status: number;
}
