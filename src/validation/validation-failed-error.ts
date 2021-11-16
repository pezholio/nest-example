import { ValidationError } from 'class-validator';

export class ValidationFailedError extends Error {
  validationErrors: ValidationError[];
  target: any;

  constructor(validationErrors) {
    super();
    this.validationErrors = validationErrors;
    this.target = validationErrors[0].target;
  }

  public fullMessages(): object {
    return this.validationErrors.reduce((map, error) => {
      map[error.property] = {
        text: Object.values(error.constraints).join(),
      };
      return map;
    }, {});
  }
}
