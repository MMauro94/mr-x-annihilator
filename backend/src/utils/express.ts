import express, {NextFunction, Request, RequestHandler, Response} from "express";
import {validationResult} from "express-validator";

/**
 * Wraps the supplied validation chains by appending a middleware that checks the validation results and
 * sends a 400 response page if invalid.
 */
export function validate(...checks: RequestHandler[]): RequestHandler {
    return composeMiddlewares([
        ...checks,
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400).json({errors: errors.array()})
            } else {
                next()
            }
        }
    ])
}

/**
 * Utility function to create a new express router.
 * Creates a new router, calls the passed function with it as parameter and returns it
 */
export function router(f: (router: express.Router) => void) {
    const router = express.Router()
    f(router)
    return router
}



function composeMiddlewares(middleware: RequestHandler[]): RequestHandler {
    return middleware.reduce((a, b) => {
        return (req, res, next) => {
            a(req, res, err => {
                if (err) {
                    return next(err)
                }
                b(req, res, next)
            })
        }
    })
}