import React from "react";
import Swal from "sweetalert2";
import "../Css/PerfilUsuario.css";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Carta from "./Carta";

const PerfilHome = () => {
  // guarda la foto del usuario
  const [foto, setFoto] = useState("");

  // guarda la informacón de la publicación
  const [publicacion, setPublicacion] = useState([]);
  const { correo } = useParams();

  /**
   * guarda las estadisticas
   * total de publicaciones
   * total de publicaciones activas
   */

  const [estadistica, setEstadistica] = useState([]);

  // guarda la informacón del usuario
  const [usuario, setUsuario] = useState([]);

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
   */

  const obtenerUsuario = async () => {
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
   * obtiene todas las publicaciones
   * del usuario
   */

  const obtenerPublicacion = async () => {
    try {
      const response = await fetch(
        `
        https://www.proyectotienda.somee.com/api/Publicaciones/obtenerPublicaciones/${correo}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const publicacion = await response.json();
        setPublicacion(publicacion);
        setFoto(publicacion[0].ruta_imagen);
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
   * obtiene el total de publicaciones
   * obtiene el total de publicaciones
   * en estado en venta de la api
   */

  const obtenerEstadisticas = async () => {
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
      modalSweetAlert("error", `Hubo un error en la aplición ${error}`, "");
    }
  };

  const useEffectAsync = async () => {
    await obtenerPublicacion();
    await obtenerEstadisticas();
    await obtenerUsuario();
  };

  useEffect(() => {
    useEffectAsync();
  }, []);

  return (
    <div className="contenedor-perfil-home">
      <div className="contenedor-1">
        <div className="contenedor-imagen">
          <img src={usuario.rutaimagen} alt="" />

        </div>
        <div className="carta">
          <div className="carta-flex">
          {publicacion.map((item) => {
            return (
              <Carta
                key={item.idPublicacion}
                idPublicacion={item.idPublicacion}
                fecha={item.fechaPublicacion.replace("T00:00:00", "")}
                descripcionPublicacion={item.descripcion}
                producto={item.nombrePublicacion}
                precio={`${item.precio}$`}
                provincia={item.provincia}
                correo={item.correoUsuario}
                imagen_perfil={foto}
                estadoPublicacion={item.estado}
              />
            );
          })}

          </div>
          
        </div>
      </div>

      <div className="contenedor-2">
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
            <h2>{estadistica[0]}</h2>
          </div>
          <div className="carta">
            <p>Publicaciones Activas</p>
            <h2>{estadistica[1]}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilHome;
