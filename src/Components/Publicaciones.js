import React from "react";
import jwt from "jsonwebtoken";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillCamera } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import Carta from "./Carta";
import ModalFormularioPublicacion from "./ModalFormularioPublicacion";
import "../Css/Publicaciones.css";

const Publicacion = () => {
  // guarda las publicaciones del usuario
  const [publicacion, setPublicacion] = useState([]);

  // guarda la información del usuario
  const [usuario, setUsuario] = useState([]);

  // guarda el estado del modal(abierto o cerrado)
  const [modal, setModal] = useState(false);

  // redirige a una pagina
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
   * obtiene la publicaciones que tiene registrada
   * el usuario.
   * El correo se obtiene del localStorage
   */
  const obtenerPublicaciones = async () => {
    try {
      const correo = JSON.parse(localStorage.getItem("session-usuario"));
      if (correo != null) {
        const response = await fetch(
          `https://www.proyectotienda.somee.com/api/Publicaciones/obtenerPublicaciones/${correo.correo}`,
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
          setPublicacion(datos);
        } else if (response.status === 404) {
          // se valida en el jsx
        } else if (response.status === 400) {
          modalSweetAlert(
            "error",
            `${response.text()}`,
            `Codigo de error:${response.status}`
          );
        }
      }
    } catch (error) {
      modalSweetAlert("error", `Hubo un error en la aplición ${error}`, "");
    }
  };

  /**
   * obtiene la informacion del usuario
   * el correo se obtiene del localStorage
   */
  const obtenerUsuario = async () => {
    const datos = JSON.parse(localStorage.getItem("session-usuario"));
    try {
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Usuarios/obtenerUsuario/${datos.correo}`,
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
        setUsuario(datos[0].nombre);
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
      modalSweetAlert("error", `Hubo un error en la aplición ${error}`, "");
    }
  };

  /**
   * abre el formulario de registro para
   * crear una nueva publicación,se abre
   * en un modal
   */
  const abrirModalPublicacion = () => {
    setModal(true);
  };

  const cerrarModal = () => {
    setModal(false);
  };

  /**
   *valida la session de usuario
   * si el token expiró sera redirigido
   * a la pagina de inicio(home)
   */

  const validarSession = () => {
    if (localStorage.getItem("session-usuario") === null) {
      navegacion("/");
    } else {
      const datos = JSON.parse(localStorage.getItem("session-usuario"));
      const token = datos.token;
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
    }
  };

  /**
   * useEffect no permiste el async await
   * este metodo sirve como alternativa
   * para esperar al obtener los datos
   */

  const useEffectAsync = async () => {
    validarSession();
    await obtenerPublicaciones();
    await obtenerUsuario();
  };

  useEffect(() => {
    if (localStorage.getItem("session-usuario") === null) {
      navegacion("/");
    } else {
      useEffectAsync();
    }
  }, []);

  /**si hay publicaciones se muestra la carta
   * con la información, de lo contrario
   * se indica que no hay publicaciones
   * asociadas al perfil de usuario
   */

  if (publicacion.length > 0) {
    return modal ? (
      <ModalFormularioPublicacion
        nuevaPublicacion={true}
        estadoModalPublicacion={modal}
        cerrarModalPublicacion={cerrarModal}
      />
    ) : (
      <div className="contenedor-publicaciones">
        <div className="encabezado">
          <h1>
            Mis Publicaciones{" "}
            <span className="icono-camara">{<AiFillCamera />}</span>
          </h1>
          <button onClick={abrirModalPublicacion}>
            <span className="icono-add">{<IoMdAdd />}</span>Agregar
          </button>
        </div>
        <div className="contenedor-carta-publicacion">
          {publicacion.map((item) => (
            <Carta
              key={item.idPublicacion}
              idPublicacion={item.idPublicacion}
              fecha={item.fechaPublicacion.replace("T00:00:00", "")}
              descripcionPublicacion={item.descripcion}
              producto={item.nombrePublicacion}
              precio={`₡ ${item.precio}`}
              provincia={item.provincia}
              correo={item.correoUsuario}
              estadoPublicacion={item.estado}
              imagen_perfil={item.ruta_imagen}
              esPublicacion={true}
            />
          ))}
          <br /> <br /> <br />
        </div>
      </div>
    );
  } else {
    return modal ? (
      <ModalFormularioPublicacion
        nuevaPublicacion={true}
        estadoModalPublicacion={modal}
        cerrarModalPublicacion={cerrarModal}
      />
    ) : (
      <div className="contenedor-publicaciones">
        <div className="encabezado">
          <h1>
            Sin publicaciónes{" "}
            <span className="icono-camara">{<AiFillCamera />}</span>
          </h1>
          <button onClick={abrirModalPublicacion}>
            <span className="icono-add">{<IoMdAdd />}</span>Agregar
          </button>
        </div>
        <div className="sin-publicacion">
          <h1 className="h1">
            Hola <span>{usuario}</span>
          </h1>
          <h2 className="h2">Agrega nuevo contenido</h2>
        </div>
      </div>
    );
  }
};

export default Publicacion;
