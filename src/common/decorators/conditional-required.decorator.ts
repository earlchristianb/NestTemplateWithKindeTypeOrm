import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function ConditionalRequired(
  property: string,
  value: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'conditionalRequired',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property, value],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName, relatedValue] = args.constraints;
          const relatedValueInObject = (args.object as any)[
            relatedPropertyName
          ];
          if (relatedValueInObject === relatedValue) {
            return value !== undefined && value !== null;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName, relatedValue] = args.constraints;
          return `${relatedPropertyName} is ${relatedValue}, so ${args.property} should not be empty`;
        },
      },
    });
  };
}
