import React from "react";
import "../Css/ItemsDesplegables.css";
import { Link } from "react-router-dom";

const ItemsDesplegables = (props) => {
  return (
    <div className="contenedor-items">
      <ul>
        <li>
            <Link className="" to={props.perfil}>
                Perfil
            </Link>
        </li>

        <li>
          <Link className="" to={props.publicaciones}>
            Publicaciones
          </Link>
        </li>

        <li>
          <Link className="" onClick={props.eventoCerrarSession}>
            Cerrar Session
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ItemsDesplegables;
