import React from "react";
import jwt from "jsonwebtoken";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/ModalFormularioPublicaciones.css";

const ModalFormularioPublicacion = (props) => {
  // guarda los datos que tiene la publicación
  const [publicacion, setPublicacion] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
  });

  // guarda la informacion de los select
  // se le debe dar un valor de inicio
  const [select, setSelect] = useState({
    provincias: "Alajuela",
    estado: "En venta",
    categorias: "Telefono/Celulares",
  });

  // guarda el valor inicial de la categoria
  const [categoria, setCategoria] = useState("");

  // guarda el valor inical de estado de la
  //categoria => vendido o en venta
  const [estadoPublicacion, setEstadoPublicacion] = useState("");

  // guarda las fotos de la publicación
  const [fotoPublicacion, setFotoPublicacion] = useState(null);

  /**
   * obtiene y carga los datos de la
   * publicación en los input
   */
  const [datosPublicacion, setDatosPublicacion] = useState([]);

  /**
   * guarda el estado de exito al
   * crear una publicacón y subir
   * la foto
   */
  let response_nuevaPublicacion = false;
  let response_subirFoto = false;

  /**
   * guarda el estado al actualizar la
   * foto y eliminarla al actualizar
   * la publicación
   */
  let response_actualizar = false;

  /**
   * guarda la publicación y obtiene
   * la categoria y el estado de la
   */
  let listaPublicacion = [];

  const navegacion = useNavigate();

  /**
   * maneja los camios de los inputs
   * maneja los combios del los select
   */

  const cambioInput = (e) => {
    // obtiene los cambios de los select
    setSelect({
      ...select,
      [e.target.name]: e.target.value,
    });

    // obtiene los cambios de los input al registrar
    setPublicacion({
      ...publicacion,
      [e.target.name]: e.target.value,
    });

    // obtiene los cambios de los input al actualizar
    setDatosPublicacion({
      ...datosPublicacion,
      [e.target.name]: e.target.value,
    });

    // obtiene los cambios del input tipo file
    setFotoPublicacion(e.target.files);
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
   * valida que no haiga campos en blanco
   * en los formulario de registro y actualizar
   * datos
   * @param {*} objeto
   * @returns => true o false
   */

  const validarCamposVacios = (objeto) => {
    if (Object.values(objeto).some((x) => x === "")) {
      return false;
    } else {
      return true;
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
    let nombreArchivos = [];
    let valido = true;
    for (const nombre of fotoPublicacion) {
      //obtiene las extensiones del archivo o archivos
      nombreArchivos.push(nombre.name.split(".").pop());
    }
    nombreArchivos.forEach((extension) => {
      if (extension !== "jpg" && extension !== "png") {
        valido = false;
      }
    });

    return valido;
  };

  /**
   * registra la publicacion
   * @param {*} idPublicacion
   * @param {*} numeroCategoria
   * @param {*} token
   * @param {*} correo
   */
  const nuevaPublicacion = async (
    idPublicacion,
    numeroCategoria,
    token,
    correo
  ) => {
    const datos = {
      idPublicacion: idPublicacion,
      nombrePublicacion: publicacion.nombre,
      descripcion: publicacion.descripcion,
      precio: publicacion.precio,
      provincia: select.provincias,
      idEstadoPublicacion: select.estado === "En venta" ? 1 : 2,
      idCategoria: numeroCategoria,
      correoUsuario: correo,
    };
    try {
      const response = await fetch(
        "https://www.proyectotienda.somee.com/api/Publicaciones/nuevo",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(datos),
        }
      );

      if (response.status === 201) {
        response_nuevaPublicacion = true;
      } else if (response.status === 409) {
        // el id ya existe
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
   * registra la foto asociado a una
   * publicación
   * @param {*} idPublicacion
   * @param {*} token
   */

  const subirFotoPublicacion = async (idPublicacion, token) => {
    const formData = new FormData();
    formData.append("idPublicacion", idPublicacion);
    for (const foto of fotoPublicacion) {
      formData.append("files", foto);
    }

    try {
      const response = await fetch(
        "https://www.proyectotienda.somee.com/api/Publicaciones/subirFoto",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.status === 201) {
        response_subirFoto = true;
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
   * el metodo que va ejecutar el formulario
   * con su evento onSubmit, es aquí donde
   * se registra la publicación
   */

  const eventoNuevaPublicacion = async () => {
    if (localStorage.getItem("session-usuario") === null) {
      navegacion("/");
    } else {
      const datos_localStorage = JSON.parse(
        localStorage.getItem("session-usuario")
      );

      const token = datos_localStorage.token;
      const correo = datos_localStorage.correo;
      if (!validarCamposVacios(publicacion)) {
        modalSweetAlert(
          "warning",
          "No pueden quedar campos vacios",
          "Llena todos los campos"
        );
      } else if (fotoPublicacion === null) {
        modalSweetAlert(
          "error",
          "La publicación necesita la menos una imagen",
          ""
        );
      } else {
        if (!esValidoExtensionArchivo()) {
          modalSweetAlert(
            "warning",
            "Las extensiones solo pueden ser jpg o png",
            "solo imagenes jpg o png"
          );
        } else {
          const categorias = {
            "Telefono/Celulares": 2,
            Computadoras: 3,
            "Pantallas/Televisores": 4,
            "Instrumentos Musicales": 6,
            Electrodomésticos: 5,
            Moda: 7,
            Deportes: 8,
            Vehículos: 9,
            "Consola/Video Juegos": 1,
          };
          const numeroCategoria = categorias[select.categorias];
          const idPublicacion = uuidv4();

          //* registrando la publicación en la api
          await nuevaPublicacion(idPublicacion, numeroCategoria, token, correo);

          //* registra la foto para la publicacón
          await subirFotoPublicacion(idPublicacion, token);

          if (!response_nuevaPublicacion) {
            modalSweetAlert(
              "error",
              "Hubo un problema al guardar la publicación",
              ""
            );
          }

          if (!response_subirFoto) {
            modalSweetAlert(
              "error",
              "Hubo un problema al guardar la foto de la publicación",
              ""
            );
          }

          if (response_nuevaPublicacion && response_subirFoto) {
            navegacion(0);
          }
        }
      }
    }
  };

  /**
   * este formulario solo sera enviado al registrar una
   * nueva publicación
   */

  const envioFormulario = (e) => {
    eventoNuevaPublicacion();
    e.preventDefault();
  };

  /**
   *
   * llama el metodo de la api que
   * va a actualizar la publicación
   * @param {*} idPublicacion
   * @param {*} token
   * @param {*} numeroCategoria
   */

  const actualizarPublicacion = async (
    idPublicacion,
    token,
    numeroCategoria
  ) => {
    const datos = {
      idPublicacion: "",
      nombrePublicacion: datosPublicacion.nombrePublicacion,
      descripcion: datosPublicacion.descripcion,
      precio: datosPublicacion.precio,
      provincia: select.provincias,
      idEstadoPublicacion: select.estado === "En venta" ? 1 : 2,
      idCategoria: numeroCategoria,
    };

    try {
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Publicaciones/actualizar/${idPublicacion}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(datos),
        }
      );

      if (response.status === 200) {
        response_actualizar = true;
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
   * elimina una o varias fotos
   * de una publicación dando
   * como parametro el idPublicación
   */

  const eliminarFotoPublicacion = async (idPublicacion, token) => {
    try {
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Publicaciones/eliminarFoto/${idPublicacion}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // no se hace nada
      } else if (response.status === 404) {
        // IdPublicacion => en caso que no existiera
      } else if (response.status === 400) {
        modalSweetAlert(
          "error",
          `${response.text()}`,
          `Codigo de error: ${response.status}`
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
   *este metodo es quien se va llamar en el 
   evento onclick del boton actualizar 
   * @param {*} e
   */

  const eventoActualizarPublicacion = async (e) => {
    if (localStorage.getItem("session-usuario") === null) {
      window.location.href = "/TiendaOnline";
    } else {
      const datos_localSorage = JSON.parse(
        localStorage.getItem("session-usuario")
      );

      const token = datos_localSorage.token;

      // el idPublicacion viene de Carta.js
      const idPublicacion = props.datos;

      if (!validarCamposVacios(datosPublicacion)) {
        modalSweetAlert(
          "warning",
          "No pueden quedar campos vacios",
          "Llena todos los campos"
        );
      } else {
        //  obtiene el numero de categoria
        const categorias = {
          "Telefono/Celulares": 2,
          Computadoras: 3,
          "Pantallas/Televisores": 4,
          "Instrumentos Musicales": 6,
          Electrodomésticos: 5,
          Moda: 7,
          Deportes: 8,
          Vehículos: 9,
          "Consola/Video Juegos": 1,
        };
        const numeroCategoria = categorias[select.categorias];

        // se actualiza la publicación
        await actualizarPublicacion(idPublicacion, token, numeroCategoria);
      }

      if(fotoPublicacion !== undefined){
        if(!esValidoExtensionArchivo()){
          modalSweetAlert(
            "warning",
            "Las extensiones solo pueden ser jpg o png",
            "solo imagenes jpg o png"
          );
        }else{
          await eliminarFotoPublicacion(idPublicacion, token);
          await subirFotoPublicacion(idPublicacion, token);
        }
      }

      if (response_actualizar) {
        navegacion(0);
      } else {
        modalSweetAlert("error", "Falló al actualizar la publicación", "");
      }
    }

    e.preventDefault();
  };

  const eliminarPublicacion = async (token, idPublicacion) => {
    try {
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Publicaciones/eliminarPublicacion/${idPublicacion}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navegacion(0);
      } else if (response.status === 404) {
        // idPublicacion => en caso que no exista
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
   * elimina una publicación y sus fotos
   */

  const eventoEliminarPublicacion = () => {
    const datos_localSorage = JSON.parse(
      localStorage.getItem("session-usuario")
    );
    const token = datos_localSorage.token;
    // el idPublicacion viene de Carta.js
    const idPublicacion = props.datos;
    Swal.fire({
      title: "Eliminar está publicación ? ",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "No cancelar",
      confirmButtonText: "Confirmar",
      reverseButtons: true,
      confirmButtonColor: "#dc3545",
    }).then(function (resultado) {
      if (resultado.isConfirmed) {
        eliminarPublicacion(token, idPublicacion);
      }
    });
  };

  /**
   * obtiene los datos de una publicación dando como
   * parametro el idPublicacion.
   * props.datos viene de Carta.js
   *
   */

  const obtenerPublicacion = async () => {
    if (localStorage.getItem("session-usuario") == null) {
      navegacion("/");
    } else {
      /**
       * props.datos viene de Carta.js
       * lo que obtiene es el valor del idPublicacion
       */
      const idPublicacion = props.datos;
      const datos = JSON.parse(localStorage.getItem("session-usuario"));
      const token = datos.token;

      if (idPublicacion !== undefined) {
        try {
          const response = await fetch(
            `https://www.proyectotienda.somee.com/api/Publicaciones/publicacionUsuario/${idPublicacion}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            const datos = await response.json();
            listaPublicacion.push(datos[0]);
            setDatosPublicacion(datos[0]);
          } else if (response.status === 404) {
            //no aplica
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
      }
    }
  };

  /**
   * obtiene el nombre de la categoria dando el
   * idCategoria que trae la api como parametro
   * se carga en el select del formulario actualizar
   */

  const valorInicialCategoria = () => {
    const categorias = {
      1: "Consola/Video Juegos",
      2: "Telefono/Celulares",
      3: "Computadoras",
      4: "Pantallas/Televisores",
      5: "Electrodomésticos",
      6: "Instrumentos musicales",
      7: "Moda",
      8: "Deportes",
      9: "Vehículos",
    };

    if (listaPublicacion.length > 0) {
      const categoria = categorias[listaPublicacion[0].idCategoria];
      setCategoria(categoria);
    }
  };

  const valorInicialEstadoPublicacion = () => {
    const estados = {
      1: "En venta",
      2: "Vendido",
    };

    if (listaPublicacion.length > 0) {
      const estado = estados[listaPublicacion[0].idEstadoPublicacion];
      setEstadoPublicacion(estado);
    }
  };

  /**
   * useEffect no async - await
   * esta funcion sirve como alternativa
   * carga los valores  de inicio
   *
   */

  const useEffectAsync = async () => {
    validarSession();
    await obtenerPublicacion();
    valorInicialCategoria();
    valorInicialEstadoPublicacion();
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
            navegacion("/TiendaOnline");
          }
        }
      );
    }
  };

  useEffect(() => {
    useEffectAsync();
  }, []);

  return props.nuevaPublicacion ? (
    /**formulario para registrar datos */

    <div
      className={
        props.estadoModalPublicacion
          ? "contenedor-modal-publicaciones"
          : "contenedor-no-modal"
      }
    >
      <div className="contenido-modal">
        <img
          src={require("../Images/cerrar-modal.png")}
          alt=""
          onClick={props.cerrarModalPublicacion}
        />
        <form onSubmit={envioFormulario}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre de la publicación"
            autoComplete="nope"
            onChange={cambioInput}
          />
          <textarea
            name="descripcion"
            cols="30"
            rows="10"
            placeholder="Descripción de la publicación"
            onChange={cambioInput}
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            autoComplete="nope"
            onChange={cambioInput}
          />
          <div className="file-select">
            <input
              type="file"
              name="imagen"
              aria-label="Archivo"
              multiple
              onChange={cambioInput}
            />
          </div>

          <div className="combo-box">
            <select name="provincias" onChange={cambioInput}>
              <option>Alajuela</option>
              <option>Cartago</option>
              <option>Guanacaste</option>
              <option>Heredia</option>
              <option>Limon</option>
              <option>Puntarenas</option>
              <option>San Jose</option>
            </select>
            <select name="categorias" onChange={cambioInput}>
              <option>Telefono/Celulares</option>
              <option>Computadoras</option>
              <option>Pantallas/Televisores</option>
              <option>Instrumentos Musicales</option>
              <option>Electrodomésticos</option>
              <option>Moda</option>
              <option>Deportes</option>
              <option>Vehículos</option>
              <option>Consola/Video Juegos</option>
            </select>
            <select name="estado" id="" onChange={cambioInput}>
              <option>En venta</option>
            </select>
          </div>

          <input type="submit" value="Registrar" className="btn-actualizar" />
        </form>
      </div>
    </div>
  ) : (
    /*Formulario al actualizar datos* */
    <div
      className={
        props.estadoModalPublicacion
          ? "contenedor-modal-publicaciones"
          : "contenedor-no-modal"
      }
    >
      <div className="contenido-modal">
        <img
          src={require("../Images/cerrar-modal.png")}
          alt=""
          onClick={props.cerrarModalPublicacion}
        />
        <form onSubmit={(e) => e.preventDefault()}>
          <h2>
            Publicacion: <span>{datosPublicacion.nombrePublicacion}</span>
          </h2>
          <input
            type="text"
            name="nombrePublicacion"
            value={datosPublicacion.nombrePublicacion || ""}
            onChange={cambioInput}
            autoComplete="nope"
          />
          <textarea
            name="descripcion"
            cols="30"
            rows="10"
            value={datosPublicacion.descripcion || ""}
            onChange={cambioInput}
          />
          <input
            type="number"
            name="precio"
            value={datosPublicacion.precio || ""}
            autoComplete="nope"
            onChange={cambioInput}
          />
          <div className="file-select">
            <input
              type="file"
              name="imagen"
              aria-label="Archivo"
              multiple
              onChange={cambioInput}
            />
          </div>

          <div className="combo-box">
            <select name="provincias" onChange={cambioInput} disabled>
              <option>{datosPublicacion.provincia}</option>
            </select>
            <select name="categorias" onChange={cambioInput} disabled>
              {/*Se carga la categoria de la publicación
              no se puede actualizar, por lo tanto solo se 
              muestra un item*/}
              <option>{categoria}</option>
            </select>
            <select name="estado" onChange={cambioInput}>
              <option>{estadoPublicacion}</option>
              <option>
                {estadoPublicacion === "En venta" ? "Vendido" : "En venta"}
              </option>
            </select>
          </div>

          <input
            type="submit"
            value="Actualizar"
            className="btn-actualizar"
            onClick={eventoActualizarPublicacion}
          />
          <input
            type="submit"
            value="Eliminar"
            className="btn-eliminar"
            onClick={eventoEliminarPublicacion}
          />
        </form>
      </div>
    </div>
  );
};

export default ModalFormularioPublicacion;
