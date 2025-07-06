import joi from 'joi'

export const validateUserCredentials = (data: object) => {
    const validateData = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required().pattern(/[0-9]/).pattern(/[a-z]/).pattern(/[A-Z]/).pattern(/[^\w]/)
    });

    return validateData.validate(data)
}

export const validateEmail = (data: object) => {
    const validateEmail = joi.object({
        email: joi.string().email().required(),
    });

    return validateEmail.validate(data)
}