import React, { useEffect, useState } from "react";
import PrintTable from "./Table";
import Header from "../Header/Header";
import { Button } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { EditStockData, UserStock } from "../../Types/Types";
import { useNavigate } from "react-router-dom";
import { postRequest, putRequest } from "../../Service/Service";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import Message from "../TostMessage/Message";

const AddStock = () => {
    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    // useEffect to check token if not then will redirect to logIn page
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token === "") {
            navigate("/");
        }
    }, []);

    // validation schema for validate add schema data
    const validateAddStockData = yup.object({
        productName: yup.string().required("* Product Name is required field"),
        productQuantity: yup
            .string()
            .required("* Product Quantity is required field"),
        productPrice: yup.string().required("* Product Price is required field"),
    });

    // formik for store data
    const { handleSubmit, handleBlur, handleChange, errors, touched, values, resetForm, setValues } = useFormik({
        initialValues: { productName: "", productQuantity: "", productPrice: "" },
        validationSchema: validateAddStockData,
        onSubmit: (values: UserStock) => {
            if (data.productName !== "" && data?.status === "edit") {
                updateStockData(values);
            } else {
                submitAddStock(values);
            }
        },
    });

    // Function for api call of addStock data
    const [reApiCall, setReApiCall] = useState<number>(0);
    const submitAddStock = (value: UserStock) => {
        postRequest("addStock", JSON.stringify(value))
            .then(() => {
                setReApiCall(1);
                resetForm();
                setSuccessMessage("Stock Added Successfully!!");
                setTimeout(() => {
                    setSuccessMessage("")
                    setReApiCall(0);
                }, 500)
            })
            .catch((err) => {
                console.log(err);
                setErrorMessage("Something Went Wrong!!");
                setTimeout(() => {
                    setErrorMessage("")
                }, 500)
            });
    };

    const [data, setData] = useState<EditStockData>({
        _id: "",
        productName: "",
        productPrice: "",
        productQuantity: "",
        status: ""
    });
    // useEffect for set the edit data
    useEffect(() => {
        if (data?.productName !== "" && data?.status === "edit") {
            setValues(data);
        }

    }, [data]);

    // Function for update stock data
    const updateStockData = (value: UserStock) => {
        const stockData = {
            id: data._id,
            ...value,
        };

        putRequest("updateStockData", JSON.stringify(stockData))
            .then(() => {
                resetForm();
                setReApiCall(1);
                setData({
                    _id: "",
                    productName: "",
                    productPrice: "",
                    productQuantity: "",
                    status: ""
                });
                setSuccessMessage("Stock Updated Successfully!!");
                setTimeout(() => {
                    setReApiCall(0);
                    setSuccessMessage("")
                }, 500)
            })
            .catch((err) => {
                setErrorMessage("")
                console.log(err);
                setErrorMessage("Something Went Wrong!!");
            });
    };

    // useEffect for the set bg height and width
    const [width, setWidth] = useState<number>(window.innerWidth);
    const [height, setHeight] = useState<number>(window.innerHeight);
    useEffect(() => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);

    }, [window.innerHeight, window.innerWidth]);

    const [id, setId] = useState<string>("");
    // function to reset confirmation modal value
    const [openConfirmationModal, setOpenConfirmationModal] = useState<number>(0);
    const resetConfirmationModal = (e: number | string) => {
        if (e === 1) {
            setReApiCall(1);
            setSuccessMessage("Stock Deleted Successfully!!");
            setTimeout(() => {
                setReApiCall(0);
                setSuccessMessage("")
            }, 500)
        }
        if (e === 2) {
            setErrorMessage("Something Went Wrong!!");
            setTimeout(() => {
                setErrorMessage("")
            }, 500)
        }
        setOpenConfirmationModal(0);
        resetForm();
    };

    // useEffect to open confirmation modal and set id for delete api call
    useEffect(() => {
        if (data?._id && data?.status === "delete") {
            setOpenConfirmationModal(1);
            setId(data?._id);
        }
    }, [data]);

    return (
        <>
            <div className="signUpCard text-white overflow-y-scroll" style={{ height: height, width: width }}>
                <div>
                    <Header />
                </div>

                <div className="w-[320px] border border-white rounded-lg mx-auto p-5 my-10">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <div className="text-white my-1">Product Name</div>
                            <input
                                type="text"
                                id="productName"
                                name="productName"
                                value={values.productName}
                                className="w-full h-8 rounded-lg mx-auto placeholder:text-black placeholder:font-semibold text-black ps-2 border border-white"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <div className="text-red-700 font-semibold">
                                <small>{touched.productName && errors.productName}</small>
                            </div>
                        </div>

                        <div className="my-5">
                            <div className="text-white my-1">Product Quantity</div>
                            <input
                                type="text"
                                id="productQuantity"
                                name="productQuantity"
                                value={values.productQuantity}
                                className="w-full h-8 border border-white rounded-lg mx-auto placeholder:text-black placeholder:font-semibold text-black ps-2"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <div className="text-red-700 font-semibold">
                                <small>
                                    {touched.productQuantity && errors.productQuantity}
                                </small>
                            </div>
                        </div>

                        <div className="my-5">
                            <div className="text-white my-1">Product Price</div>
                            <input
                                type="text"
                                id="productPrice"
                                name="productPrice"
                                value={values.productPrice}
                                className="w-full h-8 border border-white rounded-lg mx-auto placeholder:text-black placeholder:font-semibold text-black ps-2"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <div className="text-red-700 font-semibold">
                                <small>{touched.productPrice && errors.productPrice}</small>
                            </div>
                        </div>

                        <div className="mt-5 w-max mx-auto">
                            <Button placeholder={"addStock"} color="green" type="submit">{`${data.productName !== "" && data?.status === "edit" ? "Update Stock" : "+ Add Stock"}`}</Button>
                        </div>
                    </form>
                </div>

                <div>
                    <PrintTable
                        endPoint="getStockData"
                        reApiCall={reApiCall}
                        setData={setData}
                        controllers={["edit", "delete"]}
                    />
                </div>
            </div>

            <ConfirmationModal
                openConfirmationModal={openConfirmationModal}
                resetConfirmationModal={resetConfirmationModal}
                deleteEndPoint={"removeStockData"}
                id={id}
                title={"Delete Stock"}
                message={`Are you sure want to remove "${data?.productName}" from stock`}
            />

            {/* {(successMessage?.length > 0 || errorMessage?.length > 0) && <Message successMessage={successMessage} errorMessage={errorMessage} />} */}
            <Message successMessage={successMessage} errorMessage={errorMessage} />
        </>
    );
};

export default AddStock;
