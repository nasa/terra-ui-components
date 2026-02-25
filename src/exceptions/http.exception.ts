type HttpExceptionProperties = {
    status: number
    message: string
    // optionally holds the original error that caused the httpexception
    cause?: Error
}

export class HttpException extends Error {
    public status: number
    public message: string

    constructor({ status, message, cause }: HttpExceptionProperties) {
        super(message)
        this.status = status
        this.message = message
        this.cause = cause

        Object.setPrototypeOf(this, HttpException.prototype)
    }

    toString() {
        return this.message
    }
}

export class BadRequestException extends HttpException {
    constructor({ message, cause }: Omit<HttpExceptionProperties, 'status'>) {
        super({ status: 400, message, cause })
    }
}

export class NotFoundException extends HttpException {
    constructor({ message, cause }: Omit<HttpExceptionProperties, 'status'>) {
        super({ status: 404, message, cause })
    }
}

export class InternalServerErrorException extends HttpException {
    constructor({ message, cause }: Omit<HttpExceptionProperties, 'status'>) {
        super({ status: 500, message, cause })
    }
}
