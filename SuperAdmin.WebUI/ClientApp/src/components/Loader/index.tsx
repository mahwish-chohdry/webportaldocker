import React from "react";
import Loader from 'react-loader-spinner'
import './spinner.css';

export const LoaderComponent: React.FunctionComponent<any> = (props) => {
   return(
      <React.Fragment>
         <div className="spinner">
            <Loader type="ThreeDots" color="#2BAD60" height={80} width={80} />
         </div>
    </React.Fragment>
   );
}