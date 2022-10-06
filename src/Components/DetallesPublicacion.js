import React from "react";
import Swal from "sweetalert2";
import "../Css/DetallePublicacion.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Slide } from "react-slideshow-image";

const DetallesPublicacion = (props) => {
  const [usuario, setUsuario] = useState([]);

  // guarda el contacto al usuario
  const [contactoUsuario, setContactoUsuario] = useState("");

  // guarla las fotos de la publicación
  const [fotoPublicacion, setFotoPublicacion] = useState([]);

  const cambioInput = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });

    setContactoUsuario(e.target.value);
  };

  const envioFormulario = (e) => {
    if (contactoUsuario.length === 0) {
      modalSweetAlert(
        "warning",
        "No pueden ver campos en blanco",
        "Llena todos los campos"
      );
    } else {
    }

    e.preventDefault();
  };

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
   * obtiene la información del usuario
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
      if (error.message === "Failed to fetch") {
        modalSweetAlert("error", "Hubo un error de conexión", "");
      } else {
        modalSweetAlert("error", `Hubo un error en la aplicación ${error}`, "");
      }
    }
  };

  /**
   * obtiene las fotos de la publicación
   */
  const obtenerfotosPublicacion = async () => {
    // props.datos[0] viene de Carta.js
    // la posición 0 es el idPublicación

    try {
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Publicaciones/obtenerFotosPublicacion/${props.datos[0]}`,
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
        setFotoPublicacion(datos);
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
      if (error.message === "Failed to fetch") {
        modalSweetAlert("error", "Hubo un error de conexión", "");
      } else {
        modalSweetAlert("error", `Hubo un error en la aplicación ${error}`, "");
      }
    }
  };

  /**
   * useEffect no permiste el async await
   * este metodo sirve como alternativa
   * para esperar al obtener los datos
   */

  const useEffectAsync = async () => {
    await obtenerfotosPublicacion();
    if (localStorage.getItem("session-usuario") !== null) {
      const datos = JSON.parse(localStorage.getItem("session-usuario"));
      await obtenerUsuario(datos.correo);
    }else{
      setUsuario([]);
    }
  };

  useEffect(() => {
    useEffectAsync();
  }, []);

  if (fotoPublicacion.length > 0) {
    return (
      <div
        className={
          props.estado ? "contenedor-modal-mostrar" : "contenedor-modal-ocultar"
        }
      >
        <div className="contenido-modal">
          <Link to={"#"} onClick={props.cerrarModal}>
            <img
              src={require("../Images/cerrar-modal.png")}
              alt=""
              className="icono-cerrar"
            />
          </Link>
          <Slide>
            {fotoPublicacion.map((item) => (
              <div className="slide-efecto" key={item.id}>
                <img src={item.foto} alt="" />
              </div>
            ))}
          </Slide>

          <h1>
            Publicado:<span>{props.datos[1]}</span>
          </h1>
          <textarea
            cols="30"
            rows="10"
            className="descripcionPublicacion"
            value={props.datos[2]}
            readOnly
          />

          <div className="contenedor-formulario">
            <form onSubmit={envioFormulario}>
              <h2>Contacte sin compromiso</h2>
              {localStorage.getItem("session-usuario") !== null ? (
                <>
                  <input
                    type="text"
                    value={`${usuario.nombre} ${usuario.apellidos}`}
                    readOnly
                    autoComplete="off"
                    name="nombre"
                    onChange={cambioInput}
                  />
                  <input
                    type="text"
                    value={`${usuario.telefono}`}
                    readOnly
                    name="telefono"
                    onChange={cambioInput}
                  />
                  <input
                    type="text"
                    value={`${usuario.correo}`}
                    readOnly
                    autoComplete="off"
                    name="correo"
                    onChange={cambioInput}
                  />
                  <textarea
                    name="descripcion"
                    id=""
                    cols="30"
                    rows="10"
                    placeholder="Estoy interesado/interesada"
                    autoCorrect="on"
                    onChange={cambioInput}
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Inicia session para contactar"
                    readOnly
                    autoComplete="off"
                    name="nombre"
                    onChange={cambioInput}
                  />
                  <input
                    type="text"
                    placeholder="Inicia session para contactar"
                    readOnly
                    name="telefono"
                    onChange={cambioInput}
                  />
                  <input
                    type="text"
                    placeholder="Inicia session para contactar"
                    readOnly
                    autoComplete="off"
                    name="correo"
                    onChange={cambioInput}
                  />
                  <textarea
                    name="descripcion"
                    id=""
                    cols="30"
                    rows="10"
                    placeholder="Inicia session para contactar"
                    autoCorrect="on"
                    onChange={cambioInput}
                    readOnly
                  />
                </>
              )}

              <input type="submit" value="Enviar" className="btn-enviar" />
              <br />
              <br />
            </form>
            <br />
            <br />
          </div>
        </div>
      </div>
    );
  }
};

export default DetallesPublicacion;
