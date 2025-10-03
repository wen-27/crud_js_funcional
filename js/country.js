class CountryComponent extends HTMLElement {
  constructor() {
    super();
    this.editingId = null;
    this.interval = null;
  }

  connectedCallback() {
    this.load();
    this.interval = setInterval(() => this.load(), 5000);
    const form = this.closest('section').querySelector('form');
    form.addEventListener("submit", e => {
      e.preventDefault();
      this.add();
    });
    const cancelBtn = this.closest('section').querySelector('.btn-cancelar');
    cancelBtn.addEventListener('click', () => this.cancel());
    const actualizarBtn = this.closest('section').querySelector('.btn-actualizar');
    actualizarBtn.addEventListener('click', () => this.load());
  }

  async load() {
    const respuesta = await fetch("http://localhost:3000/countries");
    const data = await respuesta.json();
    const tbody = this.closest('section').querySelector('tbody');
    tbody.innerHTML = "";
    data.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>
              <button class="btn btn-editar">Editar</button>
              <button class="btn btn-eliminar">Eliminar</button>
            </td>
        `;
      tr.querySelector('.btn-eliminar').onclick = () => this.remove(item.id);
      tr.querySelector('.btn-editar').onclick = () => this.edit(item.id);
      tbody.appendChild(tr);
    });
  }

  async add() {
    const input = this.closest('section').querySelector("#country-name");
    if (!input.value.trim()) {
      alert('El nombre del país es requerido');
      return;
    }
    const url = this.editingId ? `http://localhost:3000/countries/${this.editingId}` : "http://localhost:3000/countries";
    const method = this.editingId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: input.value })
    });
    input.value = "";
    this.editingId = null;
    this.load();
  }

  async remove(id) {
    await fetch(`http://localhost:3000/countries/${id}`, { method: "DELETE" });
    this.load();
  }

  async edit(id) {
    const res = await fetch(`http://localhost:3000/countries/${id}`);
    const item = await res.json();
    const input = this.closest('section').querySelector("#country-name");
    input.value = item.name;
    this.editingId = id;
  }

  cancel() {
    const input = this.closest('section').querySelector("#country-name");
    input.value = "";
    this.editingId = null;
  }

  disconnectedCallback() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

customElements.define("country-component", CountryComponent);
