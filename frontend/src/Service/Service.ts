import axios from 'axios';

// Function to call post API 
export const postRequest = async (URL: string, data: string) => {
    try {
        const val = await axios.post(`${process.env.REACT_APP_API}/${URL}`, data, {
            headers: {
                token: localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        });

        return val.data;
    } catch (error) {
        console.log(error)
    }
};

// Function to call get API
export const getRequest = async (URL: string) => {
    try {
        const val = await axios.get(`${process.env.REACT_APP_API}/${URL}`, {
            headers: {
                "token": localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        });

        return val.data;
    } catch (error) {
        console.log(error);
    }
};

// Function to call put API
export const putRequest = async (URL: string, data: string) => {
    try {
        const val = await axios.put(`${process.env.REACT_APP_API}/${URL}`, data, {
            headers: {
                "token": localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        })

        return val.data;
    } catch (error) {
        console.log(error);
    }
};

// Function to call delete API
export const deleteRequest = async (URL: string) => {
    try {
        const val = await axios.delete(`${process.env.REACT_APP_API}/${URL}`, {
            headers: {
                "token": localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        })

        return val.data;
    } catch (error) {
        console.log(error);
    }
} 