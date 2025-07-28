import { useDispatch } from "react-redux";

export const FilterForm = () => {

    const dispath = useDispatch();

    const handleChange = e => {

        dispath({type: "filter/setFilter", payload: e.target.value});
    };

    return (
        <p>
            filter: <input type="text" onChange={handleChange}/>
        </p>
    );
};