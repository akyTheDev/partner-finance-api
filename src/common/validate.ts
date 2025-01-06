import { plainToInstance } from 'class-transformer'
import { validateSync, ValidationError } from 'class-validator'

import { UnprocessableEntityError } from './errors'

function formatValidationErrors(errors: ValidationError[]): string {
  for (const error of errors) {
    if (error.constraints) {
      const firstMessage = Object.values(error.constraints)[0]
      if (firstMessage) {
        return firstMessage
      }
    }
  }
  return 'Unknown validation error'
}

export function validate<T extends object>(
  cls: new () => T,
  input: Record<string, unknown>,
): T {
  const validatedInstance = plainToInstance(cls, input, {
    enableImplicitConversion: false,
  })

  const errors = validateSync(validatedInstance, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    throw new UnprocessableEntityError(formatValidationErrors(errors))
  }

  return validatedInstance
}
