// import React, { Component } from "react";
import React from "react";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, isAuth, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}
export default PrivateRoute;

// class PrivateRoute extends Component {
//   render() {
//     return (
//       <Route
//         {...this.props.rest}
//         render={(props) =>
//           this.props.isAuth ? (
//             <Component {...props} />
//           ) : (
//             <Redirect to="/login" />
//           )
//         }
//       />
//     );
//   }
// }
// export default PrivateRoute;
