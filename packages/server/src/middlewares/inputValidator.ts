import { NextFunction, Request, Response } from "express";
import { ObjectSchema, ValidationError } from "yup";

export const inputValidator = (
  bodySchema: ObjectSchema<any> | null,
  paramsSchema?: ObjectSchema<any> | null,
  querySchema?: ObjectSchema<any> | null
) =>
  async function validatorHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (bodySchema) {
        await bodySchema.validate(req.body, { abortEarly: false });
      }
      if (paramsSchema) {
        await paramsSchema.validate(req.params, { abortEarly: false });
      }
      if (querySchema) {
        await querySchema.validate(req.query, { abortEarly: false });
      }
      next();
    } catch (error: any) {
      const err: any = {};
      error.inner.forEach((e: ValidationError) => {
        err[(e as any).path] = e.message;
      });
      console.error(err);
      res.status(400).json(err);
    }
  };
