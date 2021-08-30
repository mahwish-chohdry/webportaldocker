import React, { Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { isAuthenticated } from '../../utils'

export class PrivateRoute extends React.Component<any, any> {
    render(){
        return(
            <Fragment>
                { isAuthenticated() ? this.props.children : <Redirect to="/login" /> }
            </Fragment>
        );
    }
}
