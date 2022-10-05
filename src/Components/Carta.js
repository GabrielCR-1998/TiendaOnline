import React from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Slide } from "react-slideshow-image";
import { useState } from "react";
import { useEffect } from "react";
import DetallesPublicacion from "./DetallesPublicacion";
import ModalFormularioPublicacion from "./ModalFormularioPublicacion";
import "react-slideshow-image/dist/styles.css";
import "../Css/Carta.css";

const Carta = (props) => {
  // guarda las fotos de la publicacion
  const [fotoPublicacion, setFotoPublicacion] = useState([]);

  /* gaurda los parametros(idPublicacion,fecha,descripcion)
  que se va a cargar en el modal DetallesPublicacion.js*/
  const [datos, setDatos] = useState([]); // gurada el idPublicacion y la fecha

  // guarda el estado del modal del detalle de la  publicación(true o false)
  const [mostrarModal, setMostrarModal] = useState(false);

  // gaurda el estado del modal de publicacion(registro o actualizar)
  const [modalPublicacion, setModalPublicacion] = useState(false);

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
   * obtiene las fotos de una aplicación dando
   * como parametro el idPublicación
   *
   */

  const obtenerfotosPublicacion = async () => {
    try {
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Publicaciones/obtenerFotosPublicacion/${props.idPublicacion}`,
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
      if(error.message === "Failed to fetch"){
        modalSweetAlert("error", "Hubo un error de conexión", "");
      }else{
        modalSweetAlert("error", `Hubo un error en la aplicación ${error}`, "");
      }  
    }
  };

  /**
   * abre el modal que se va a encargar del
   * registro de la publicación o actaulizarla
   */

  const abrirModalPublicacion = () => {
    setDatos(props.idPublicacion);

    setModalPublicacion(true);
  };


    /**
   * cierra el modal que se va a encargar del
   * registro de la publicación o actaulizarla
   */

  const cerrarModalPublicacion = () => {
    setModalPublicacion(false);
  };

  /**
   * abre el modal donde se observa
   * la informacion de la publicacion
   */

  const abrirModal = () => {
    setMostrarModal(true);
    const datos = [
      props.idPublicacion,
      props.fecha,
      props.descripcionPublicacion,
    ];

    setDatos(datos);
  };

  /**
   * cierra el modal donde se observa
   * la información de la publicacion
   */

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  /**
   * useEffect no permiste el async await
   * este metodo sirve como alternativa
   * para esperar al obtener los datos
   */

   const useEffectAsync = async () =>{
    await obtenerfotosPublicacion();
  };

  useEffect(() => {
    useEffectAsync();
  }, []);


  if (fotoPublicacion.length > 0) {
    if (mostrarModal && props.estadoPublicacion === 1) {
      return (
        <DetallesPublicacion
          datos={datos}
          estado={mostrarModal}
          cerrarModal={cerrarModal}
        />
      );
    } else if (modalPublicacion) {
      return (
        <ModalFormularioPublicacion
          estadoModalPublicacion={modalPublicacion}
          cerrarModalPublicacion={cerrarModalPublicacion}
          datos={datos}
        />
      );
    } else {
      return (
        <div className="contenedor-espacio">
          <div className="carta">
            <Slide autoplay={true}>
              {fotoPublicacion.map((item) => (
                <div className="slide-efecto" key={item.id}>
                  <img
                    src={item.foto}
                    alt=""
                    onClick={
                      props.esPublicacion ? abrirModalPublicacion : abrirModal
                    }
                  />
                </div>
              ))}
            </Slide>
            <div className="informacion">
              <div className="perfil">
                <img src={props.imagen_perfil} alt="" />
                {props.nombre == null && props.apellido == null ? null : (
                  <Link to={`/perfilUsuario/${props.correo}`}>
                    {`${props.nombre} ${props.apellido}`}
                  </Link>
                )}
              </div>
              <div
                className="contenedor-parrafos"
                onClick={
                  props.esPublicacion ? abrirModalPublicacion : abrirModal
                }
              >
                <h2>{props.producto}</h2>
                <h2 className="h2_precio">{props.precio}</h2>
                <h2>{props.provincia}</h2>
                {props.estadoPublicacion === 1 ? (
                  <h2 style={{ color: "#d3ad7f" }}>En venta</h2>
                ) : (
                  <h2 style={{ color: "red" }}>Vendido</h2>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
};

export default Carta;
