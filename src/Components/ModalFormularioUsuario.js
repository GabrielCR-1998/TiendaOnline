import React from "react";
import jwt from "jsonwebtoken";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "../Css/ModalFormularioUsuario.css";

const ModalFormularioUsuario = (props) => {
  // guarda los datos del usuario
  const [usuario, setUsuario] = useState([]);

  // muestra o oculta el formulario del password
  const [esPassword, setEsPassword] = useState(false);

  // para actualizar el password
  const [password, setPassword] = useState({
    passwordActual: "",
    passwordNueva: "",
    verificarPassword: "",
  });

  // obtiene el token de la session
  const datos = JSON.parse(localStorage.getItem("session-usuario"));

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
   * maneja el cambio del input type file
   * @param {*} e
   */

  const cambioInput = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });

    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * valida que no haya campos vacio
   * al actulizar datos
   * true => si no hay campos vacios
   * false => si hay campos vacios
   * @returns true
   */

  const esCampoVacio = () => {
    const valido = Object.values(usuario).some((x) => x === "");
    if (!valido) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * actualiza los datos del usuario
   * @param {*} correo
   * @param {*} token
   */

  const actualizarUsuario = async (correo, token) => {
    const datos = {
      correo: usuario.correo,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      telefono: usuario.telefono,
      password: "", // el password no se actualiza para este caso
    };

    try {
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Usuarios/actualizar/${correo}`,
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
        const datos = {
          correo:usuario.correo,
          token:token
        }
        localStorage.removeItem("session-usuario");
        localStorage.setItem("session-usuario",JSON.stringify(datos));
        navegacion(0);
      } else if (response.status === 404) {
        // en caso de que el correo no exista
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

  const envioFormulario = (e) => {
    const correo = props.correo;
    if (esCampoVacio()) {
      actualizarUsuario(correo, datos.token);
    } else {
      modalSweetAlert("error", "No se permiten campos vacios", "");
    }
    e.preventDefault();
  };

  /**
   * consulta la api para validar
   * si la contraseña desencriptada es
   * igual a la encriptada
   * @param {*} correo
   * @param {*} token
   */

  const validarPassword = async (correo, token) => {
    const datos = {
      correo: "",
      nombre: "",
      apellidos: "",
      password: password.passwordActual,
      telefono: "",
    };

    try {
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Usuarios/verificarPassword/${correo}`,
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

      if (response.status === 200) {
        return true;
      } else if (response.status === 404) {
        // en caso de que el correo no exista
      } else if (response.status === 400) {
        modalSweetAlert(
          "error",
          `${response.text()}`,
          `Codigo de error:${response.status}`
        );
      }
      return false;
    } catch (error) {
      if(error.message === "Failed to fetch"){
        modalSweetAlert("error", "Hubo un error de conexión", "");
      }else{
        modalSweetAlert("error", `Hubo un error en la aplicación ${error}`, "");
      } 
    }
  };

  /**
   * valida que nueva contraseña coencida
   * con la contraseña de validación
   * @returns true o false
   */

  const sonPasswordIguales = () => {
    if (password.passwordNueva === password.verificarPassword) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * actualiza el passwor del usuario
   * @param {*} correo
   * @param {*} token
   */

  const actualizarPassword = async (correo, token) => {
    const datos = {
      correo: "",
      nombre: "",
      apellidos: "",
      password: password.passwordNueva,
      telefono: "",
    };
    try {
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Usuarios/actualizarPassword/${correo}`,
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
        modalSweetAlert(
          "success",
          "Contraseña actualizada",
          ""
        );
        navegacion(0);
      } else if (response.status === 404) {
        // correo => no existe
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
   * onSubmit => error async
   * este metodo se usa como alternativa
   * para actualizar el password, se necesita
   * esperar el resultado del metodo => validarPassword()
   */

  const eventoActualizarPassword = async () => {
    const token = datos.token;
    const correo = props.correo;
    if (
      password.passwordActual === "" ||
      password.passwordNueva === "" ||
      password.verificarPassword === ""
    ) {
      modalSweetAlert(
        "warning",
        "No se permiten campos vacios",
        "Llena todos los campos"
      );
    } else {
      if (await validarPassword(correo, token)) {
        if (sonPasswordIguales()) {
          await actualizarPassword(correo, token);
        } else {
          modalSweetAlert("error", "Las contraseñas no coenciden", "");
        }
      }
    }
  };

  /**
   * evento onSubmit para actualizar el
   * password de usuario
   * @param {*} e
   */

  const envioFormularioPassword = (e) => {
    eventoActualizarPassword();
    e.preventDefault();
  };

  /**
   * obtiene la información del usuario
   * esta información se carga en los
   * inputs
   */

  const obtenerUsuario = async () => {
    const correo = props.correo;
    try {
      const response = await fetch(
        `https://www.proyectotienda.somee.com/api/Usuarios/obtenerUsuario/${correo}
        `,
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
   * muestra e oculta el formulario
   * de cambio de password
   */

  const mostrarCambioPassword = () => {
    setEsPassword(!esPassword);
  };

  /**
   *valida la session de usuario
   * si el token expiró sera redirigido
   * a la pagina de inicio(home)
   */

  const validarSession = () => {
    if (localStorage.getItem("session-usuario") === null) {
      navegacion("/TiendaOnline");
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

  /**
   * useEffect no permiste el async await
   * este metodo sirve como alternativa
   * para esperar al obtener los datos
   */

  const useEffectAsync = async () => {
    validarSession();
    await obtenerUsuario();
  };

  useEffect(() => {
    useEffectAsync();
  }, []);

  return (
    <div
      className={
        props.modal
          ? "contenedor-modal-perfil"
          : "contenedor-modal-perfil-cerrado"
      }
    >
      <div className="contenido-modal">
        <img
          src={require("../Images/cerrar-modal.png")}
          onClick={props.cerrarModal}
          alt=""
        />
        <form onSubmit={envioFormulario}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            autoComplete="nope"
            value={usuario.nombre || ""}
            onChange={cambioInput}
          />
          <input
            type="text"
            name="apellidos"
            placeholder="Apellido"
            autoComplete="nope"
            value={usuario.apellidos || ""}
            onChange={cambioInput}
          />
          <input
            type="text"
            name="telefono"
            placeholder="Telefono"
            autoComplete="nope"
            value={usuario.telefono || ""}
            onChange={cambioInput}
          />
          <input
            type="text"
            name="correo"
            placeholder="Correo"
            autoComplete="nope"
            value={usuario.correo || ""}
            onChange={cambioInput}
            readOnly
          />

          <input
            type="submit"
            value="Actualizar Datos"
            className="btn-actualizar"
          />
        </form>

        <Link className="enlace" onClick={mostrarCambioPassword}>
          Actualizar Contraseña?
        </Link>
        <div className="cambio-password">
          <form
            className={esPassword ? "mostrar-formulario" : "formulario-ocultar"}
            onSubmit={envioFormularioPassword}
          >
            <input
              type="password"
              name="passwordActual"
              placeholder="Escriba su contraseña actual"
              onChange={cambioInput}
            />
            <input
              type="password"
              name="passwordNueva"
              placeholder="Escriba su contraseña nueva"
              onChange={cambioInput}
            />
            <input
              type="password"
              name="verificarPassword"
              placeholder="Vuleva a escribir su contraseña nueva"
              onChange={cambioInput}
            />

            <input
              type="submit"
              value="Actualizar contraseña"
              className="btn-actualizar"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalFormularioUsuario;
