import React from 'react';

function Field({ val, chooseField }){
  return (
    <div className="field" onClick={ chooseField }>
      { val }
    </div>
  );
}

export default Field;