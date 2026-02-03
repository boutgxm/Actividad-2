const inputTarea = document.querySelector("#nueva-tarea");
const btnAgregar = document.querySelector("#agregar-tarea");
const listaTareas = document.querySelector("#lista-tareas");
const mensaje = document.querySelector("#mensaje");


const mostrarMensaje = (texto) => {
  mensaje.textContent = texto;
  setTimeout(() => (mensaje.textContent = ""), 2000);
};


class Tarea {
  constructor(nombre) {
    this.id = crypto.randomUUID(); 
    this.nombre = nombre;
    this.completa = false;
  }

  toggleCompleta() {
    this.completa = !this.completa;
  }

  editar(nuevoNombre) {
    this.nombre = nuevoNombre;
  }
}


class GestorDeTareas {
  constructor() {
    this.tareas = [];
  }

  guardarEnLocalStorage() {
    localStorage.setItem("tareas", JSON.stringify(this.tareas));
  }

  cargarDesdeLocalStorage() {
    const data = localStorage.getItem("tareas");
    if (!data) return;

    const tareasGuardadas = JSON.parse(data);


    this.tareas = tareasGuardadas.map((t) => {
      const tarea = new Tarea(t.nombre);
      tarea.id = t.id;
      tarea.completa = t.completa;
      return tarea;
    });

    this.render();
  }

  agregarTarea(nombre) {
    const tarea = new Tarea(nombre);
    this.tareas.push(tarea);
    this.guardarEnLocalStorage();
    this.render();
  }

  eliminarTarea(id) {
    this.tareas = this.tareas.filter((t) => t.id !== id);
    this.guardarEnLocalStorage();
    this.render();
  }

  editarTarea(id, nuevoNombre) {
    const tarea = this.tareas.find((t) => t.id === id);
    if (!tarea) return;
    tarea.editar(nuevoNombre);
    this.guardarEnLocalStorage();
    this.render();
  }

  toggleCompleta(id) {
    const tarea = this.tareas.find((t) => t.id === id);
    if (!tarea) return;
    tarea.toggleCompleta();
    this.guardarEnLocalStorage();
    this.render();
  }

  render() {

    listaTareas.innerHTML = "";


    this.tareas.forEach((tarea) => {
      const li = document.createElement("li");
      li.classList.add("tarea");
      li.dataset.id = tarea.id;

      li.innerHTML = `
        <label class="texto-tarea">
          <input class="check" type="checkbox" ${tarea.completa ? "checked" : ""}>
          <span class="${tarea.completa ? "completa" : ""}">${tarea.nombre}</span>
        </label>
        <div class="acciones">
          <button class="editar" type="button">Editar</button>
          <button class="eliminar" type="button">Eliminar</button>
        </div>
      `;

      listaTareas.appendChild(li);
    });
  }
}


const gestor = new GestorDeTareas();
gestor.cargarDesdeLocalStorage();


btnAgregar.addEventListener("click", () => {
  const texto = inputTarea.value.trim();

  if (texto === "") {
    mostrarMensaje("⚠️ No puedes agregar una tarea vacía.");
    return;
  }

  gestor.agregarTarea(texto);
  inputTarea.value = "";
  inputTarea.focus();
});

inputTarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    btnAgregar.click();
  }
});


listaTareas.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const id = li.dataset.id;

  if (e.target.classList.contains("eliminar")) {
    gestor.eliminarTarea(id);
  }

  if (e.target.classList.contains("editar")) {
    const tareaActual = gestor.tareas.find((t) => t.id === id);
    if (!tareaActual) return;

    const nuevoTexto = prompt("Edita la tarea:", tareaActual.nombre);

    if (nuevoTexto !== null && nuevoTexto.trim() !== "") {
      gestor.editarTarea(id, nuevoTexto.trim());
    }
  }
});


listaTareas.addEventListener("change", (e) => {
  if (!e.target.classList.contains("check")) return;

  const li = e.target.closest("li");
  const id = li.dataset.id;
  gestor.toggleCompleta(id);
});
