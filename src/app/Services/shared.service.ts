import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export interface ResponseError {
  statusCode?: number;
  message?: string;
  messageDetail?: string;
  code?: string;
  timestamp?: string;
  path?: string;
  method?: string;
}
type ToastError = ResponseError | string | HttpErrorResponse | ProgressEvent | null | undefined;


@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  async managementToast(
    element: string,
    validRequest: boolean,
    error?: ToastError
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
  private buildErrorMessage(error?: ToastError): string {
    const defaultMsg = 'Error on form submitted. Please, check the logs.';

    if (!error) {
      return defaultMsg;
    }

    if (typeof error === 'string') {
      return error;
    }
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'No se pudo conectar con el servidor. ¿Está la API en ejecución?';
      }

      return this.buildErrorMessage(error.error || error.message);
    }

    if (error instanceof ProgressEvent) {
      return 'No se pudo conectar con el servidor. Comprueba tu conexión o que la API esté activa.';
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
  errorLog(error: ToastError): void {
    if (!error) {
      console.error('Unknown error.');
      return;
  }
  if (error instanceof HttpErrorResponse) {
    console.error('url:', error.url ?? 'N/A');
    console.error('status:', error.status);
    console.error('message:', error.message);
    if (error.error && error.error !== error.message) {
      this.errorLog(error.error as ToastError);
    }
    return;
  }

  if (error instanceof ProgressEvent) {
    console.error('Network error:', error.type);
    return;
  }

  if (typeof error === 'string') {
    console.error('message:', error);
    return;
  }

  console.error('path:', error.path ?? 'N/A');
  console.error('timestamp:', error.timestamp ?? 'N/A');
  console.error('message:', error.message ?? 'N/A');
  console.error('messageDetail:', error.messageDetail ?? 'N/A');
  console.error('statusCode:', error.statusCode ?? 'N/A');
}

  async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
