import React, { useEffect, useState } from 'react'
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { ConfirmationModalTypes } from '../../Types/Types';
import { deleteRequest } from '../../Service/Service';

export default function ConfirmationModal({ openConfirmationModal, resetConfirmationModal, deleteEndPoint, id, title, message }: ConfirmationModalTypes) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
        resetConfirmationModal(0)
    }

    useEffect(() => {
        if (openConfirmationModal === 1) {
            setOpen(true)
        }
    }, [openConfirmationModal])

    // function for perform delete operation
    const deleteUserData = () => {
        deleteRequest(deleteEndPoint, JSON.stringify({ "id": id })).then((res) => {
            if (res?.message) {
                setOpen(false)
                resetConfirmationModal(1)
            }
        }).catch((err) => {
            console.log(err)
            resetConfirmationModal(2)
            setOpen(false)
        })
    }

    return (
        <div>
            <Dialog placeholder={'mainDialog'} open={open} handler={handleOpen} animate={{
                mount: { scale: 1, y: 0 }, unmount: { scale: 0.9, y: -100 }
            }}
            >
                <DialogHeader placeholder={'title'}>{title?.length > 0 ? title : ''}</DialogHeader>
                <DialogBody placeholder={'body'}>
                    {message?.length > 0 ? message : ''}
                </DialogBody>
                <DialogFooter placeholder={'footer'}>
                    <Button
                        placeholder={'cancel'}
                        variant="gradient"
                        color="green"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button placeholder={'delete'} variant="gradient" color="red" id={id} onClick={deleteUserData}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    )
}
