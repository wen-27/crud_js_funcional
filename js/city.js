class CityComponent extends HTMLElement {
    constructor() {
    super();
    this.editingId = null;
    this.interval = null;
    }
    connectedCallback(){
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
    async load(){
        const res = await fetch("http://localhost:3000/cities?_expand=region");
    const data = await res.json();
    const tbody = this.closest('section').querySelector('tbody');
    tbody.innerHTML = "";
    data.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.region?.name || ""}</td>
            <td>
              <button class="btn btn-editar">Editar</button>
              <button class="btn btn-eliminar">Eliminar</button>
            </td>
        `;
      tr.querySelector('.btn-eliminar').onclick = () => this.remove(item.id);
      tr.querySelector('.btn-editar').onclick = () => this.edit(item.id);
      tbody.appendChild(tr);
    });

    const regions = await (await fetch("http://localhost:3000/regions")).json();
    this.closest('section').querySelector("#city-region").innerHTML =
      regions.map(r => `<option value="${r.id}">${r.name}</option>`).join("");
  }

  async add() {
    const name = this.closest('section').querySelector("#city-name").value;
    if (!name.trim()) {
      alert('El nombre de la ciudad es requerido');
      return;
    }
    const regionId = parseInt(this.closest('section').querySelector("#city-region").value);
    const url = this.editingId ? `http://localhost:3000/cities/${this.editingId}` : "http://localhost:3000/cities";
    const method = this.editingId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, regionId })
    });
    this.editingId = null;
    this.load();
  }
   async remove(id) {
    await fetch(`http://localhost:3000/cities/${id}`, { method: "DELETE" });
    this.load();
  }

  async edit(id) {
    const res = await fetch(`http://localhost:3000/cities/${id}`);
    const item = await res.json();
    const nameInput = this.closest('section').querySelector("#city-name");
    const regionSelect = this.closest('section').querySelector("#city-region");
    nameInput.value = item.name;
    regionSelect.value = item.regionId;
    this.editingId = id;
  }

  cancel() {
    const nameInput = this.closest('section').querySelector("#city-name");
    const regionSelect = this.closest('section').querySelector("#city-region");
    nameInput.value = "";
    regionSelect.value = "";
    this.editingId = null;
  }

  disconnectedCallback() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <h2>Cities</h2>
      <form>
        <input id="name" placeholder="City name" />
        <select id="region"></select>
        <button>Add</button>
      </form>
      <ul id="list"></ul>
    `;
  }
}
customElements.define("city-component", CityComponent);


