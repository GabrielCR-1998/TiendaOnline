import React from "react";
import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Publicaciones from "./Components/Publicaciones";
import PerfilHome from "./Components/PerfilHome";

import Footer from "./Components/Footer";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

import MenuHorizonatl from "./Components/MenuHorizontal";
import MenuVertical from "./Components/MenuVertical";
import Login from "./Components/Login";
import Perfil from "./Components/Perfil";

function App() {
  // se encarga de abrir y cerrar el menu lateral
  const [valor, setEventoMenu] = useState(false);

  // abre y cierra el modal de inicio de session
  const [login, setLogin] = useState(false);

  // obtiene el estado del token
  const [tokenValido, setTokenValido] = useState(true);

  //evento que se ejecuta en el archivo MenuHorizontal.js
  //se encraga de abrir y cerrar el menú

  const eventoClickMenu = () => {
    setEventoMenu(!valor);
  };

  /**
     *evento que se ejecuta en el archivo MenuHorizontal.js 
     *se encarga de mostrar el modal de inicio de session
     o de registro de usuario
    */

  const modal_inicioSession = () => {
    setLogin(true);
  };

  /**
   * evento que se ejecuta en el archivo Login.js
   * cierra la ventana modal de de inicio de session
   * o registro de usuario
   */

  const cerrar_modalInicioSession = () => {
    setLogin(false);
  };

  /**valida si en el local-storage esta vacia
   * si no lo esta se revisa el estado del token
   */
  const validarSession = () => {
    const token = JSON.parse(localStorage.getItem("session-usuario"));
    // verifica si hay una session en el local-storage
    if (token !== null) {
      jwt.verify(
        token.token,
        "This is my supper secret key for jwt",
        function (err, decoded) {
          if (err) {
            // Token expirado
            setTokenValido(false);
          }
        }
      );
    }
  };

  useEffect(() => {
    validarSession();
  });

  return (
    <BrowserRouter>
      <div className="App">
        {
          // eventoClick => abre y cierra el menu lateral
          /* login => abre el modal con los formularios
         de registro e inicio de session*/
          /*  tokenValido => recibe el token para validar los
          iconos.(menu,inicio de session)  */
        }
        <MenuHorizonatl
          eventoClick={eventoClickMenu}
          login={modal_inicioSession}
          tokenValido={tokenValido}
        />

        <MenuVertical valor={valor} />

        {login ? (
          <Login mostrar cerrar_modal={cerrar_modalInicioSession} />
        ) : null}

        <Routes>
          <Route exact path="/TiendaOnline" element={<Home />} />
          <Route exact path="/TiendaOnline/publicaciones" element={<Publicaciones />} />
          <Route exact path="/perfil" element = {<Perfil />} />
          <Route exact path="/TiendaOnline/perfilUsuario/:correo" element={<PerfilHome />} />
        </Routes>
        <Footer />
      </div>
      
    </BrowserRouter>
  );
}

export default App;
