import React from 'react';
import 'simplebar/dist/simplebar.css';

const NotFound = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404</h1>
              <h4 className="pt-3">Oops! You're lost.</h4>
              <p className="text-medium-emphasis">The page you are looking for was not found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
