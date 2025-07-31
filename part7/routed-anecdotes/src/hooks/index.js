import { useState } from "react";

export const useField = (type, init) => {

    const [field, setField] = useState(init ?? "");

    const onChange = e => setField(e.target.value);

    const reset = () => setField(init ?? "");

    return [
        {
            type,
            value: field,
            onChange
        },
        reset
    ];
};