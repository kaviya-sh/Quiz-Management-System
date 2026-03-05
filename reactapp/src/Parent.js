
import React, {useState} from "react";

const Parent=() => {
    const[value,setValue]=useState(10);
    function add(){
        setValue(value+2);
        document.body.style.backgroundColor="pink";
        document.getElementById("txt").style.color="white";
    }
    function reduce(){
        setValue(value-2);
        document.body.style.backgroundColor="gray";
        document.getElementById("txt").style.color="black";
    }
    return(
        <div>
            <h1 id="txt">{value}</h1>
            <button OnClick>={add}>Add</button>
            
        </div>

    );
}