import joi from 'joi'

export const validateRegisterUser = (data: object) => {

    const valiDateUserData = joi.object({
        email: joi.string().required().email(),
        firstName: joi.string().required().regex(/^[a-zA-z]+$/),
        lastName: joi.string().required().pattern(/^[a-zA-z]+$/),
        country: joi.string().required(),
        city: joi.string().required()
    })

    return valiDateUserData.validate(data)
}