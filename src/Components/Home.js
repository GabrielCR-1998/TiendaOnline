import React from "react";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import Carta from "./Carta";
import "../Css/Home.css";

const Home = () => {
  // guarda las publicaciones activas que trae la api
  const [publicaciones, setPublicaciones] = useState([]);

  // guarda las publicaciones por categoria
  const [publicacionCategoria, setPublicacionCategoria] = useState([]);

  // guarda la publicación por provincia
  const [publicacionProvincia, setPublicacionProvincia] = useState([]);

  // guarda la publicación por categoria-provincia

  const [publicacionCategoriaProvincia, setPublicacionCategoriaProvincia] =
    useState([]);

  const [select, setSelect] = useState({
    provincias: "Todas",
    categorias: "Todas",
  });

  /**
   * cambio de valor del select
   * @param {*} e 
   */

  const cambioSelect = (e) => {
    setSelect({
      ...select,
      [e.target.name]: e.target.value,
    });
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
   * Consume el metodo get obtenerPublicacionesActivas
   * de la api de la tienda online.
   * obtiene los productos en que estan en venta.
   */

  const obtener_publicaciones = async () => {
    try {
      const response = await fetch(
        "https://www.proyectotienda.somee.com/api/Publicaciones/obtenerPublicacionesActivas",
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
        setPublicaciones(datos);
      } else if (response.status === 404) {
        modalSweetAlert("warning", "No hay publicaciones todavia", "");
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

  const obtenerPublicacionCategoria = async () => {
    const categorias = {
      "Consola/Video Juegos": 1,
      "Telefono Celulares": 2,
      Computadoras: 3,
      "Pantallas/Televisores": 4,
      Electrodomésticos: 5,
      "Instrumentos musicales": 6,
      Moda: 7,
      Deportes: 8,
      Vehículos: 9,
    };

    const numeroCategoria = categorias[select.categorias];
    try {
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Publicaciones/obtenerPublicacionPorCategoria/${numeroCategoria}`,
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
        setPublicacionCategoria(datos);
      } else if (response.status === 404) {
        modalSweetAlert("error", "La busqueda no coincide", "");
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

  const obtenerPublicacionesProvincia = async () => {
    try {
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Publicaciones/obtenerPublicacionPorProvincia/${select.provincias}`,
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
        setPublicacionProvincia(datos);
      } else if (response.status === 404) {
        modalSweetAlert("error", "La busqueda no coincide", "");
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

  const obtenerPublicacionCategoriaProvincia = async () => {
    const categorias = {
      "Consola/Video Juegos": 1,
      "Telefono Celulares": 2,
      Computadoras: 3,
      "Pantallas/Televisores": 4,
      Electrodomésticos: 5,
      "Instrumentos musicales": 6,
      Moda: 7,
      Deportes: 8,
      Vehículos: 9,
    };

    try {
      const numeroCategoria = categorias[select.categorias];
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Publicaciones/obtenerPublicacionesPorCategoria_Provincia/${numeroCategoria}/${select.provincias}`,
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
        setPublicacionCategoriaProvincia(datos);
      } else if (response.status === 404) {
        modalSweetAlert("error", "La busqueda no coincide", "");
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
   * useEffect no permiste el async await
   * este metodo sirve como alternativa
   * para esperar al obtener los datos
   */
  const useEffectAsync = async () => {
    await obtener_publicaciones();
  };

  useEffect(() => {
    useEffectAsync();
  }, []);
  
  useEffect (() =>{
    if(select.categorias !== "Todas"){
      obtenerPublicacionCategoria();
    };
  },[select.categorias]);

  useEffect (() =>{
    if(select.provincias !== "Todas"){
      obtenerPublicacionesProvincia();
    };
  },[select.provincias]);


  useEffect (() =>{
    if(select.provincias !== "Todas" && select.categorias !== "Todas"){
      obtenerPublicacionCategoriaProvincia();
    };
  },[select.categorias,select.provincias]);

  return (
    <div className="contenedor">
      <div className="contenedor-imagen">
        <Slide autoplay={true}>
          <div className="slide-efecto">
            <img src={require("../Images/imagen-slide-1.jpg")} alt="" />
          </div>

          <div className="slide-efecto">
            <img src={require("../Images/slide-imagen-2.jpg")} alt="" />
          </div>

          <div className="slide-efecto">
            <img src={require("../Images/imagen-slide-3.jpg")} alt="" />
          </div>
        </Slide>
      </div>
      <div className="contenedor-descripcion">
        <h1>Compra y venta</h1>
        <div className="contenedor-imagenes">
          <img src={require("../Images/icono-bolsa.png")} alt="" />
          <img src={require("../Images/laptop.png")} alt="" />
        </div>

        <div className="contenedor-parrafos">
          <p>compra Articulos</p>
          <p>Vende Articulos</p>
        </div>
        <h2>Articulos de tu interés</h2>
        <div className="contenedor-select">
          <div className="provincias">
            <h3>Buscas en </h3>
            <select
              name="provincias"
              onChange={cambioSelect}
              value = {select.provincias}
            >
              <option>Todas</option>
              <option>Alajuela</option>
              <option>Cartago</option>
              <option>Guanacaste</option>
              <option>Heredia</option>
              <option>Limon</option>
              <option>Puntarenas</option>
              <option>San Jose</option>
            </select>
          </div>
          <div className="categorias">
            <h3>Que quieres encontrar</h3>
            <select
              name="categorias"
              onChange={cambioSelect}
              value = {select.categorias}
            >
              <option>Todas</option>
              <option>Telefono Celulares</option>
              <option>Computadoras</option>
              <option>Pantallas/Televisores</option>
              <option>Electrodomésticos</option>
              <option>Instrumentos musicales</option>
              <option>Moda</option>
              <option>Deportes</option>
              <option>Vehículos</option>
              <option>Consola/Video Juegos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="contenedor-carta">
        {select.categorias === "Todas" && select.provincias === "Todas"
          ? publicaciones.map((item) => (
              <Carta
                key={item.idPublicacion}
                idPublicacion={item.idPublicacion}
                fecha={item.fecha.replace("T00:00:00", "")}
                descripcionPublicacion={item.descripcion}
                producto={item.nombre_Publicacion}
                precio={`₡ ${item.precio}`}
                provincia={item.provincia}
                nombre={item.nombreUsuario}
                apellido={item.apellido}
                correo={item.correoUsuario}
                imagen_perfil={item.fotoPerfil}
                estadoPublicacion={item.idEstadoPublicacion}
              />
            ))
          : null}

        {select.categorias !== "Todas" && select.provincias === "Todas"
          ? publicacionCategoria.map((item) => {
              return (
                <Carta
                  key={item.idPublicacion}
                  idPublicacion={item.idPublicacion}
                  fecha={item.fechaPublicacion.replace("T00:00:00", "")}
                  descripcionPublicacion={item.descripcion}
                  producto={item.nombre_Publicacion}
                  precio={`₡ ${item.precio}`}
                  provincia={item.provincia}
                  nombre={item.nombreUsuario}
                  apellido={item.apellido}
                  correo={item.correoUsuario}
                  imagen_perfil={item.fotoPerfil}
                  estadoPublicacion={item.idEstadoPublicacion}
                />
              );
            })
          : null}

        {select.provincias !== "Todas" && select.categorias === "Todas"
          ? publicacionProvincia.map((item) => {
              return (
                <Carta
                  key={item.idPublicacion}
                  idPublicacion={item.idPublicacion}
                  fecha={item.fechaPublicacion.replace("T00:00:00", "")}
                  descripcionPublicacion={item.descripcion}
                  producto={item.nombre_Publicacion}
                  precio={`₡ ${item.precio}`}
                  provincia={item.provincia}
                  nombre={item.nombreUsuario}
                  apellido={item.apellido}
                  correo={item.correoUsuario}
                  imagen_perfil={item.fotoPerfil}
                  estadoPublicacion={item.idEstadoPublicacion}
                />
              );
            })
          : null}

        {select.provincias !== "Todas" && select.categorias !== "Todas"
          ? publicacionCategoriaProvincia.map((item) => {
              return (
                <Carta
                  key={item.idPublicacion}
                  idPublicacion={item.idPublicacion}
                  fecha={item.fechaPublicacion.replace("T00:00:00", "")}
                  descripcionPublicacion={item.descripcion}
                  producto={item.nombre_Publicacion}
                  precio={`₡ ${item.precio}`}
                  provincia={item.provincia}
                  nombre={item.nombreUsuario}
                  apellido={item.apellido}
                  correo={item.correoUsuario}
                  imagen_perfil={item.fotoPerfil}
                  estadoPublicacion={item.idEstadoPublicacion}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};

export default Home;
