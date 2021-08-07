export default class ErrorException extends Error {
  status: boolean = false;
  error?: string;
  errorObject?: any;

  /**
   * constructor
   * @param {boolean} status 
   * @param {string} message 
   * @param {string} error 
   */
  constructor(status: boolean, message: string, error?: string)
  {
    super(message);
    this.status = status;
    this.error = error;
  }

  /**
   * create error
   * @param {any} data 
   * @param {any} error
   * @returns {ErrorException}
   */
  static create(data: any, error: any)
  {
    let object = new ErrorException(data.status, data.message, data?.error);
    object.errorObject = error;
    return object;
  }
}