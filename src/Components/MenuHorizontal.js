import React from "react";
import { Link } from "react-router-dom";
import "../Css/MenuHorizontal.css";

const MenuHorizonatl = (props) => {
  return (
    <div className="contenedor-menu_horizontal">
      {
        /**si el token es valido, es decir
         * no ha caducado se muestra el icono del
         * menu.
         * si el token no es valido(Expirado) no se
         * muestra el icono del menú
         */
        props.tokenValido && localStorage.getItem('session-usuario') != null ?  (
          <div className="icono-menu">
            <img
              src={require("../Images/logo_menu.png")}
              alt=""
              onClick={props.eventoClick}
            />
          </div>
        ) : null
      }

      <div className="contenedor-items">
        <div className="contenedor-logo">
          <Link className="" to={"/"}>
            <img
              src={require("../Images/icono-app.png")}
              alt=""
              className="logo"
            />
          </Link>

          <h2>Publica y vende</h2>
        </div>

        <div className="contenedor-input">
          <input type="text" placeholder="Buscas algo" />
          <button>Buscar</button>

        </div>

        <div className="contenedor-redes-sociales">
          {
            /**si el token esta activo quiere decir que hay
             * una session activa, por lo tanto se oculta el
             * icono de iniciar session.
             * el icono de inicio de session solo aparecera
             * minetras no haya una session activa
             */
            localStorage.getItem("session-usuario") === null ||
            !props.tokenValido ? (
              <img
                src={require("../Images/iniciarSession.png")}
                alt=""
                onClick={props.login}
              />
            ) : null
          }

          <Link className="" to={props.facebook}>
            <img src={require("../Images/facebook.png")} alt="" />
          </Link>

          <Link className="" to={props.instagram}>
            <img src={require("../Images/instagram.png")} alt="" />
          </Link>

          <Link className="" to={props.twitter}>
            <img src={require("../Images/twitter.png")} alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MenuHorizonatl;
