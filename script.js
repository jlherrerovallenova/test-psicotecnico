
let preguntas = [];
let indice = 0;
let respuestas = [];

window.onload = function () {
  if (localStorage.getItem("indice")) {
    indice = parseInt(localStorage.getItem("indice"));
    respuestas = JSON.parse(localStorage.getItem("respuestas")) || [];
  }

  fetch("preguntas.json")
    .then(res => res.json())
    .then(data => {
      preguntas = data;
      mostrarPregunta();
    });

  document.getElementById("continuar").onclick = () => {
    indice++;
    localStorage.setItem("indice", indice);
    localStorage.setItem("respuestas", JSON.stringify(respuestas));
    mostrarPregunta();
  };

  document.getElementById("reiniciar").onclick = () => {
    localStorage.removeItem("indice");
    localStorage.removeItem("respuestas");
    location.reload();
  };
};

function mostrarPregunta() {
  const p = preguntas[indice];
  const preguntaDiv = document.getElementById("pregunta");
  const respuestasDiv = document.getElementById("respuestas");
  const resultadoDiv = document.getElementById("resultado");
  const continuarBtn = document.getElementById("continuar");

  if (!p) {
    preguntaDiv.innerText = "Has completado el test.";
    respuestasDiv.innerHTML = "";
    continuarBtn.style.display = "none";

    const total = respuestas.length;
    const correctas = respuestas.filter(r => r).length;

    resultadoDiv.innerHTML = `<h3>Resumen:</h3>
      <p>Preguntas correctas: ${correctas} de ${total}</p>
      <p>Puntuación: ${(correctas / total * 100).toFixed(2)}%</p>`;
    return;
  }

  preguntaDiv.innerHTML = p.imagen 
    ? `<img src="${p.imagen}" alt="img" style="max-width:100%"><p>${p.pregunta}</p>`
    : `<p>${p.pregunta}</p>`;

  respuestasDiv.innerHTML = "";
  resultadoDiv.innerHTML = "";

  p.opciones.forEach((op, i) => {
    const b = document.createElement("button");
    b.innerText = op;
    b.onclick = () => {
      const correcto = i === p.correcta;
      resultadoDiv.innerText = correcto ? "✅ Correcto" : "❌ Incorrecto";
      respuestas[indice] = correcto;
    };
    respuestasDiv.appendChild(b);
  });
}
