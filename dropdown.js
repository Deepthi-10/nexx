import { useState } from "react";
import { Menu } from "grommet";
import { useStateContext } from '../../lib/context';
import { navigateProducts } from '../../App.js';
import { useNavigate } from "react-router-dom";
const options = ["Daily builds","Release builds", "QA builds"];


export const DropDown = ({option}) => {
  //sessionStorage.clear("SelectedServer")
  
  
 const { setConnection } = useStateContext();

 const [selected, setSelected] = useState(option);

 const navigate = useNavigate()
 const navigateProducts = ()=>{
   navigate('/products')
 }
 //setConnection(sessionStorage.getItem("SelectedServer"))

const HandleSelect = (value) => {
 setSelected(value);
 setConnection(value);
 sessionStorage.setItem("SelectedServer",value)
navigateProducts()
};



 return (
<Menu
 label={selected}
 items={options.map((option) => ({
 label: option,
 onClick: () => HandleSelect(option),
 }))}
 />
 );
};



export default DropDown;

