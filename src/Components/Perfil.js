import React from "react";
import Swal from "sweetalert2";
import jwt from "jsonwebtoken";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalFormularioUsuario from "./ModalFormularioUsuario";
import "../Css/Perfil.css";

const Perfil = () => {
  // guarda la información del usuario
  const [usuario, setUsuario] = useState([]);

  // guarda el estado del modal
  const [modal, setModal] = useState(false);

  // guarda el correo del localStorage
  const [correoUsuario, setCorreoUsuario] = useState("");

  const [imagen, setImagen] = useState(null);

  /**
   * guarda las estadisticas
   * total de publicaciones
   * total de publicaciones activas
   */

  const [estadistica, setEstadistica] = useState([]);
  const navegacion = useNavigate();

  /**
   * alerta sweet alert2
   * @param {*} icono
   * @param {*} mensaje
   * @param {*} footer
   */

  const modalSweetAlert = (icono, mensaje, footer) => {
    Swal.fire({
      title: "!Espera",
      html: `<h3 className="">${mensaje}</h3>`,
      icon: icono,
      footer: `<h5 className=''>${footer}</h5>`,
      width: "50%",
      backdrop: true,
      position: "center",
      allowOutsideClick: false,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#ED4C67",
      background: "#ecf0f1",
      timer: "60000",
    });
  };

  /**
   * maneja el camio del input type file
   * @param {*} e
   */
  const cambioInput = (e) => {
    setImagen(e.target.files[0]);
  };

  /**
   * abre el modal de perfil de usuario
   */

  const abrirModal = () => {
    setModal(true);
  };

  /**
   * cierra el modal de perfil de usuario
   */
  const cerrarModal = () => {
    setModal(false);
  };

  /**
   * obtiene los datos del usuario
   * @param {*} correo
   */

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
      } else if (response.status === 404) {
        // no aplica
      } else if (response.status === 400) {
        modalSweetAlert(
          "error",
          `${response.text()}`,
          `Codigo de error:${response.status}`
        );
      }
    } catch (error) {
      if(error.message === "Failed to fetch"){
        modalSweetAlert("error", "Hubo un error de conexión", "");
      }else{
        modalSweetAlert("error", `Hubo un error en la aplicación ${error}`, "");
      }  
    }
  };

  /**
   * Valida la extensión de los
   * archivos, solo se aceptan
   * jpg y png
   * true => extensiones validas
   * false => extensiones no validas
   */

  const esValidoExtensionArchivo = () => {
    let extension = imagen.name.split(".").pop();
    extension = extension.toLowerCase();
    if (extension !== "jpg" && extension !== "png") {
      return false;
    } else {
      return true;
    }
  };

  /**
   *actualiza la foto de usuario
   * @param {*} correo
   * @param {*} token
   */

  const actualizarFoto = async (correo, token) => {
    const formData = new FormData();
    formData.append("correo", null);
    formData.append("nombre", null);
    formData.append("apellidos", null);
    formData.append("password", null);
    formData.append("foto", imagen);

    try {
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Usuarios/actualizarFotoPerfil/${correo}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      if (response.status === 200) {
        alert("Foto actualizada");
        window.location.href = "/perfil";
      } else if (response.status === 404) {
        // no aplica
      } else if (response.status === 400) {
        modalSweetAlert(
          "error",
          `${response.text()}`,
          `Codigo de error:${response.status}`
        );
      }
    } catch (error) {
      if(error.message === "Failed to fetch"){
        modalSweetAlert("error", "Hubo un error de conexión", "");
      }else{
        modalSweetAlert("error", `Hubo un error en la aplicación ${error}`, "");
      }  
    }
  };

  /**
   *
   * @param {*} e
   */
  const envioFormulario = (e) => {
    const datos = JSON.parse(localStorage.getItem("session-usuario"));
    if (esValidoExtensionArchivo()) {
      actualizarFoto(datos.correo, datos.token);
    } else {
      alert("la extension del archivo no es valida");
    }
    e.preventDefault();
  };

  /**
   * obtiene el total de publicaciones
   * obtiene el total de publicaciones
   * en estado en venta de la api
   * @param {*} correo
   */

  const obtenerEstadisticas = async (correo) => {
    try {
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Publicaciones/estadisticasPublicacion/${correo}`,
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
        setEstadistica(datos);
      } else if (response.status === 404) {
        // no aplica
      } else if (response.status === 400) {
        modalSweetAlert(
          "error",
          `${response.text()}`,
          `Codigo de error:${response.status}`
        );
        
      }
    } catch (error) {
      if(error.message === "Failed to fetch"){
        modalSweetAlert("error", "Hubo un error de conexión", "");
      }else{
        modalSweetAlert("error", `Hubo un error en la aplicación ${error}`, "");
      } 
    }
  };

  /**
   *valida la session de usuario
   *si el token expiró sera redirigido
   *a la pagina de inicio(home)
   * @param {*} token
   */

  const validarSession = (token) => {
    jwt.verify(
      token,
      "This is my supper secret key for jwt",
      function (err, decoded) {
        if (err) {
          modalSweetAlert(
            "warning",
            "Session expirada",
            "Vuleve a iniciar session"
          );
          localStorage.removeItem("session-usuario");
          navegacion("/");
        }
      }
    );
  };

  /**
   * useEffect no permiste el async await
   * este metodo sirve como alternativa
   * para esperar al obtener los datos
   */

   const useEffectAsync = async () =>{
    const datos = JSON.parse(localStorage.getItem("session-usuario"));
    validarSession(datos.token);
    await obtenerUsuario(datos.correo);
    await obtenerEstadisticas(datos.correo);

      /**
       * obtiene el correo del localStorage
       * se envia al modal del perfil de usuario
       * para cargar los datos
      */

      setCorreoUsuario(datos.correo);
  };

  useEffect(() => {
    if (localStorage.getItem("session-usuario") === null) {
      navegacion("/");
    } else {
      useEffectAsync();
    }
  }, []);

  return modal ? (
    <ModalFormularioUsuario
      modal={modal}
      cerrarModal={cerrarModal}
      correo={correoUsuario}
    />
  ) : (
    <div className="contenedor-perfil">
      <div className="contenedor-imagen-perfil">
        <img src={usuario.rutaimagen} alt="" />
        <h2>{`${usuario.nombre} ${usuario.apellidos}`}</h2>
        <form onSubmit={envioFormulario}>
          <div className="file-select">
            <input type="file" name="imagen" onChange={cambioInput} />
          </div>
          <input
            type="submit"
            value="Aplicar cambios"
            className={imagen != null ? "btn-guardar" : "btn-ocultar"}
          />
        </form>
      </div>

      <div className="contenedor-informacion">
        <h1>Mis Datos</h1>
        <button onClick={abrirModal}>Editar</button>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Telefono</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellidos}</td>
              <td>{usuario.telefono}</td>
              <td>{usuario.correo}</td>
            </tr>
          </tbody>
        </table>

        <div className="contenedor-carta">
          <div className="carta">
            <p>Total de publicaciones</p>
            <h2>{estadistica.length > 0 ? estadistica[0] : 0}</h2>
          </div>
          <div className="carta">
            <p>Publicaciones Activas</p>
            <h2>{estadistica.length > 0 ? estadistica[1] : 0}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
