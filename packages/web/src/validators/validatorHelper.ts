import { SchemaOf } from "yup";

export const yupSchemaWrapper = (schema: SchemaOf<any>) => {
  return async <T>(
    data: T
  ): Promise<{
    isValid: boolean;
    errors: { [key in Extract<keyof T, string>]?: string } | null;
  }> => {
    try {
      await schema.validate(data, { abortEarly: false });
      return {
        isValid: true,
        errors: null,
      };
    } catch (yupError: any) {
      const errors: any = {};
      yupError.inner.forEach((e: any) => {
        errors[e.path] = e.message;
      });
      return {
        isValid: false,
        errors,
      };
    }
  };
};
