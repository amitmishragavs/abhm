import React, { useEffect, useState } from "react";

const { stringify, parse } = JSON;

export function useFormInput(defaultInputs = {}) {
    const [inputs, setInputs] = useState(defaultInputs);

   

    const changeHandler = (event) => {
        const { name, value } = event.target;
        updateInputs(name,value)
    }

    const updateInputs = (key,value) =>{
        const newInputs = parse(stringify(inputs))
        newInputs[key] = value
        setInputs(newInputs);
    }

    return [inputs, changeHandler, updateInputs];

}