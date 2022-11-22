import React from 'react';

const Spinner = ({ onClick }) =>
  <div className="spinner" onClick={onClick}>
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>;

export default Spinner;