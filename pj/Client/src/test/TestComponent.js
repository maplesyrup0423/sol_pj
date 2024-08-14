import React from "react";

function TestComponent(props){
    return(
        <div>
        <h1>user_no : {props.user_no}  || user_id: {props.user_id}</h1>
        </div>
    );
}

export default TestComponent;