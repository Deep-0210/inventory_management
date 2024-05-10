import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import PrintTable from "./Table";
import RegisterUserData from "../UserRegistration/RegisterUserData";
import Message from "../TostMessage/Message";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const VendorList = () => {
  // useEffect for the set bg height and width
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);
  useEffect(() => {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);
    // eslint-disable-next-line
  }, [window.innerHeight, window.innerWidth]);

  const [data, setData] = useState({
    city: "",
    country: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    _id: "",
    status: ""
  });
  const [openModal, setOpenModal] = useState<number>(0);
  const [reApiCall, setReApiCall] = useState<number>(0);

  useEffect(() => {
    if (data?.role?.length > 0 && data?.status === "edit") {
      setOpenModal(2);
      setTimeout(() => {
        setOpenModal(0);
      }, 1000);
    }
    // eslint-disable-next-line
  }, [data]);

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const resetModalValue = (e: string) => {
    if (e === "updated") {
      setSuccessMessage("User Updated Successfully!!");
      setReApiCall(1);
      setTimeout(() => {
        setReApiCall(0);
        setSuccessMessage("");
      }, 4500);
    }

    if (e === "error") {
      setErrorMessage("Something Went Wrong!!");
      setTimeout(() => {
        setReApiCall(0);
        setErrorMessage("");
      }, 4500);
    }
  };

  const [id, setId] = useState<string>("");
  // function to reset confirmation modal value
  const [openConfirmationModal, setOpenConfirmationModal] = useState<number>(0);
  const resetConfirmationModal = (e: number) => {
    if (e === 1) {
      setReApiCall(1);
      setSuccessMessage("User Removed Successfully!!");
    }
    if (e === 2) {
      setErrorMessage("Something Went Wrong!!");
    }
    setOpenConfirmationModal(0);
  };

  useEffect(() => {
    if (data && "_id" in data && data?._id?.length > 0 && data?.status === "delete") {
      setId(data?._id);
      setOpenConfirmationModal(1);
    }
  }, [data]);

  return (
    <div className="signUpCard" style={{ height: height, width: width }}>
      <div>
        <Header />
      </div>
      <div className="">
        <PrintTable
          endPoint="getVendorList"
          reApiCall={reApiCall}
          setData={setData}
          controllers={["edit", "delete"]}
        />
      </div>

      <RegisterUserData
        userData={data}
        openModal={openModal}
        resetModalValue={resetModalValue}
      />

      {(successMessage?.length > 0 || errorMessage?.length > 0) && (
        <Message
          successMessage={successMessage?.length ? successMessage : ""}
          errorMessage={errorMessage?.length ? errorMessage : ""}
        />
      )}

      <ConfirmationModal
        openConfirmationModal={openConfirmationModal}
        resetConfirmationModal={resetConfirmationModal}
        deleteEndPoint={"deleteUserData"}
        id={id}
        title={"Remove Vendor"}
        message={`Are you sure want to remove "${data?.firstName} ${data?.lastName}" from list`}
      />
    </div>
  );
};

export default VendorList;
