import { Injectable } from '@angular/core';

export interface ResponseError {
  statusCode: number;
  message: string;
  messageDetail: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  async managementToast(
    element: string,
    validRequest: boolean,
    error?: ResponseError| string
  ): Promise<void> {
    const toastMsg = document.getElementById(element);
    if (toastMsg) {
      if (validRequest) {
        toastMsg.className = 'show requestOk';
        toastMsg.textContent = 'Form submitted successfully.';
        await this.wait(2500);
        toastMsg.className = toastMsg.className.replace('show', '');
      } else {
        toastMsg.className = 'show requestKo';
        toastMsg.textContent = this.buildErrorMessage(error); 

        await this.wait(2500);
        toastMsg.className = toastMsg.className.replace('show', '');
      }
    }
  }
  private buildErrorMessage(error?: ResponseError | string): string {
    const defaultMsg = 'Error on form submitted. Please, check the logs.';

    if (!error) {
      return defaultMsg;
    }

    if (typeof error === 'string') {
      return error;
    }

    const message = error.message ?? 'Unexpected error.';
    const messageDetail = error.messageDetail
      ? ` Message detail: ${error.messageDetail}.`
      : '';
    const statusCode = error.statusCode
      ? ` Status code: ${error.statusCode}.`
      : '';

    return `${message}${messageDetail}${statusCode}`;
  }
  errorLog(error: ResponseError): void {
    console.error('path:', error.path);
    console.error('timestamp:', error.timestamp);
    console.error('message:', error.message);
    console.error('messageDetail:', error.messageDetail);
    console.error('statusCode:', error.statusCode);
  }

  async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
