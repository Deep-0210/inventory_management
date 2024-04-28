import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Message({ successMessage, errorMessage }: { successMessage: string, errorMessage: string }) {

    useEffect(() => {
        if (successMessage?.length > 0) {
            console.log(successMessage,'successMessage...')
            sMessage(successMessage)
        }
    }, [successMessage])

    useEffect(() => {
        if (errorMessage?.length > 0) {
            eMessage(errorMessage)
        }
    }, [errorMessage])

    const eMessage = (data: string) => {
        toast.error(`${data}`, {
            className: "login-toast",
            position: 'bottom-left',
            autoClose: 3000
        });
    };

    const sMessage = (data: string) => {
        toast.success(`${data}`, {
            className: "login-toast",
            position: 'bottom-left',
            autoClose: 3000
        });
    };

    return (
        <div>
            <ToastContainer />
        </div>
    )
}
