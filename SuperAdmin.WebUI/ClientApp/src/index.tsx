
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { store } from "./action/store";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from "./layouts/Admin";
import Login from "./views/Login";
import UserRightsManagement from "./views/UserRightsManagement";
import { PrivateRoute } from './components/PrivateRoute';
import TokenAlert from './components/TokenAlert';
ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ToastContainer />
      <TokenAlert/>
      <Switch>
        <Route exact path="/login" render={props => <Login  {...props} />} /> {/* The component which is used in any redirect should be declared first so that DOM can find the component to redirect */}
        <Route exact path="/" ><Redirect to="/login"/></Route> {/*exact keyword is necessary otherwise it will redirect all routes mentioned below to /login */}
        <PrivateRoute>
          <Route path="/admin" render={(props: any) => <AdminLayout {...props} />} />
        </PrivateRoute>   
      </Switch>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
