import { ZodError, ZodType} from "zod";
import { Request, Response, NextFunction } from "express";

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const error = result.error as ZodError;

      // 🔹 Acesso moderno aos erros
      const formattedErrors = error.issues.map((issue) => ({
        path: issue.path.join("."), // exemplo: "varinha.madeira"
        message: issue.message,
      }));

      return res.status(400).json({
        message: "Erro de validação dos dados enviados.",
        errors: formattedErrors,
      });
    }

    req.body = result.data;
    next();
  };
}
