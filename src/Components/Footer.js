import React from "react";
import { Link } from "react-router-dom";

import '../Css/Footer.css';

const Footer = (props) =>{
    return (
        <div className="contenedor-footer">
            <div className="sobre-nosotros">
             <h2>Sobre Esta aplicación</h2>
             <p>Esta aplicación es crada con el proposito de enseñar las habilidades de programación tanto el backend y fronend</p>
             <br />
             <p>Tecnologias usuadas:.Net-core, SQL-Server por parte del
                backend</p>
             <br />
             <p>Html y css con el Framewok de javascript React</p>

            </div>

            <div className="categorias">
                <Link className="a" to={props.celulares}>Celulares</Link>
                <Link  className="a" to={props.video_juegos}>Video Juegos</Link>
                <Link  className="a" to={props.computadoras}>Computadoras</Link>
                <Link  className="a" to={props.electrodomésticos}>Electrodomésticos</Link>
                <Link  className="a" to={props.instrumenetos}>Instrumentos Musicales</Link>
                <Link  className="a" to={props.moda}>Moda</Link>
                <Link  className="a" to={props.deporte}>Deportes</Link>
                <Link  className="a" to={props.vehiculos}>Vehiculos</Link>
            </div>

            <div className="links">
                <h2>Links</h2>
                <Link className="a" to={props.perfil}>Perfil</Link>
                <Link className="a" to={props.publicaciones}>Publicaciones</Link>  
            </div>
        </div>
    );
}


export default Footer;
