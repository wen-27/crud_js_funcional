
import './branche.js';
import './city.js';
import './companie.js';
import './country.js';
import './region.js';


document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".navbar a");
  const secciones = document.querySelectorAll(".contenido");
 
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); 


      secciones.forEach(sec => sec.classList.remove("visible"));


      links.forEach(l => l.classList.remove("active"));


      link.classList.add("active");


      const targetId = link.getAttribute("href").substring(1);
      document.getElementById(targetId).classList.add("visible");
    });
  });
});
