import React from "react";
import SweetAlert from 'sweetalert2-react';
import { isTokenExpired, clearToken } from 'utils';
class TokenAlert extends React.Component {

    render() {
        console.log(isTokenExpired());
        return (
            <React.Fragment>
                <SweetAlert
                    show={isTokenExpired()? true: false}
                    title="Login Session expired!"
                    text="Please try to login again"
                    confirmButtonText='Logout'
                    onConfirm={() => clearToken()}
                />
            </React.Fragment>
        );
    }
}

export default TokenAlert;