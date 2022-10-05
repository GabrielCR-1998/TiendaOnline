import React from "react";
import Swal from "sweetalert2";
import { AiOutlineMail } from "react-icons/ai";
import { AiFillPhone } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/Login.css";

const Login = (props) => {
  const [usuario, setUsuario] = useState({
    email: "",
    nombre: "",
    apellido: "",
    password: "",
    telefono: "",
  });

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

  const cambioInput = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });

  };

  const estaVacio = () => {
    // busca si un valor del objeto(javascript) esta vacio
    return Object.values(usuario).some((x) => x === "");
  };

  // valida que el correo tenga @

  const esCorreoValido = () => {
    return usuario.email.includes("@");
  };

  const envioFormularioRegistro = (e) => {
    if (estaVacio()) {
      modalSweetAlert(
        "warning",
        "No se permiten campos vacios",
        "Llena todos los campos"
      );
      e.preventDefault();
    } else if (!esCorreoValido()) {
      modalSweetAlert("warning", "el correo no es valido", "");
      e.preventDefault();
    } else {
      registrarUsuario();
      e.preventDefault();
    }
   
  };

  const envioFormularioInicioSssion =  (e) => {
    if (usuario.email.length === 0 || usuario.password.length === 0) {
      modalSweetAlert(
        "warning",
        "No se permiten campos vacios",
        "Llena todos los campos"
      );

      e.preventDefault();
      
    } else {
      IniciarSession();
      e.preventDefault();
    }
  };

  /**
   * registra una nueva cuenta de usuario
   */

  const registrarUsuario = async () => {
    try {
      // datos que necesita la api para registrar usuarios
      let datos = {
        Correo: usuario.email,
        Nombre: usuario.nombre,
        Apellidos: usuario.apellido,
        Password: usuario.password,
        Telefono: usuario.telefono,
        // el rol se insertar 2 por defecto
        Rol: "2",
      };

      const response = await fetch(
        "https://www.proyectotienda.somee.com/api/Usuarios/nuevo",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify(datos),
        }
      );

      if (response.status === 409) {
        modalSweetAlert(
          "error",
          "Este correo ya existe",
          `Codigo de error:${response.status}`
        );
      } else if (response.status === 200) {
        const token = await response.json();

        // otiene el token devuelto y
        // se gurada en el localStorage
        const session = {
          correo: usuario.email,
          token: token.token,
        };

        localStorage.setItem("session-usuario", JSON.stringify(session));
        navegacion("/perfil");
        navegacion(0);
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

  const IniciarSession = async  () => {    
    try {
      const datos = {
        correo: usuario.email,
        nombre: "",
        apellidos: "",
        password: usuario.password,
        telefono: "",
        rutaimagen: "",
        rol: 0,
        foto: null,
      };

      const response = await fetch(
        "https://www.proyectotienda.somee.com/api/Usuarios/login",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify(datos),
        }
      );

      if (response.status === 404) {
        modalSweetAlert("error", "El password o contraseña no son validos", "");
      } else if (response.status === 200) {
        const token = await response.json();
        const session = {
          correo: usuario.email,
          token: token.token,
        };

        localStorage.setItem("session-usuario", JSON.stringify(session));
        navegacion(0);
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

  return (
    <div
      className={
        props.mostrar
          ? "contenedor-login-modal"
          : "contenedor-login-modal-ocultar"
      }
    >
      <div className="iniciar-session">
        <h2>Tienes una cuenta?</h2>
        <br />
        <form onSubmit={envioFormularioInicioSssion}>
          <div className="grupo_input">
            <i>{<AiOutlineMail />}</i>
            <input
              type="text"
              placeholder="Email"
              autoComplete="nope"
              name="email"
              onChange={cambioInput}
            />
          </div>
          <div className="grupo_input">
            <i>{<RiLockPasswordFill />}</i>
            <input
              type="password"
              placeholder="Contraseña"
              autoComplete="off"
              name="password"
              onChange={cambioInput}
            />
          </div>

          <input type="submit" value="Iniciar Session" className="btn-input" />
          
        </form>
      </div>
      <div className="registrarse">
        <img
          src={require("../Images/cerrar-modal.png")}
          alt=""
          onClick={props.cerrar_modal}
        />
        <h2>Registrarse</h2>
        <br />
        <form onSubmit={envioFormularioRegistro}>
          <div className="grupo_input">
            <i>{<FaUserAlt />}</i>
            <input
              type="text"
              placeholder="nombre"
              autoComplete="nope"
              name="nombre"
              onChange={cambioInput}
            />
            <input
              type="text"
              placeholder="Apellido"
              autoComplete="nope"
              name="apellido"
              onChange={cambioInput}
            />
          </div>
          <div className="grupo_input">
            <i>{<AiOutlineMail />}</i>
            <input
              type="email"
              placeholder="Email"
              autoComplete="nope"
              name="email"
              onChange={cambioInput}
            />
            <i className="icono-telefono">{<AiFillPhone />}</i>
            <input
              type="number"
              placeholder="Telefono"
              autoComplete="nope"
              name="telefono"
              onChange={cambioInput}
            />
          </div>
          <div className="grupo_input">
            <i>{<RiLockPasswordFill />}</i>
            <input
              type="password"
              className="input-password"
              placeholder="Password"
              name="password"
              onChange={cambioInput}
            />
          </div>
          <input type="submit" value="Registrarse" className="btn-input" />
        </form>
      </div>
    </div>
  );
};

export default Login;
