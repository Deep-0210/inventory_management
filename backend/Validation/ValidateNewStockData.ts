import joi from "joi";

export const validateAddStockData = (data: object) => {
    const validateData = joi.object({
        productName: joi.string().required(),
        productQuantity: joi.string().required(),
        productPrice: joi.string().required()
    });

    return validateData.validate(data)
}