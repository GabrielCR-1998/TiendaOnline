import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "../Css/MenuVertical.css";
import ItemsDesplegables from "./ItemsDesplegables";

const MenuVertical = ({ valor }) => {
  const [usuario, setUsuario] = useState([]);
  const obtenerUsuario = async (correo) => {
    try {
      const response = await fetch(
        `
        https://www.proyectotienda.somee.com/api/Usuarios/obtenerUsuario/${correo}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const datos = await response.json();
        setUsuario(datos[0]);
      } 
    } catch (error) {
      
      
    }
  };

  const useEffectAysnc = async () =>{
   if(localStorage.getItem("session-usuario") !== null){
      const datos = JSON.parse(localStorage.getItem("session-usuario"));
      await obtenerUsuario(datos.correo)
    }
    
  };

  useEffect(()=>{
    useEffectAysnc();
  },[]);

  const cerrarSession = () => {
    localStorage.removeItem("session-usuario");
    window.location.href = "/";
  };
  return (
    <div
      className={
        valor ? "contenedor-menu_vertical" : "contenedor-menu_vertica_ocultar"
      }
    >
      <div className="contenedor-imagen_perfil">
        <img src={usuario.rutaimagen} alt="" />
      </div>
      <ItemsDesplegables
        perfil={"/perfil"}
        publicaciones={"/publicaciones"}
        cerrarSession = {"/"}
        eventoCerrarSession={cerrarSession}
      />
    </div>
  );
};

export default MenuVertical;
