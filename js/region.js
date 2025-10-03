class RegionComponent extends HTMLElement {
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
        const respuesta = await fetch("http://localhost:3000/regions?_expand=country")
        const data = await respuesta.json();
        const tbody = this.closest('section').querySelector('tbody');
        tbody.innerHTML= "";
        data.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.country?.name || ""}</td>
            <td>
              <button class="btn btn-editar">Editar</button>
              <button class="btn btn-eliminar">Eliminar</button>
            </td>
        `;
        tr.querySelector('.btn-eliminar').onclick = () => this.remove(item.id);
        tr.querySelector('.btn-editar').onclick = () => this.edit(item.id);
        tbody.appendChild(tr);
    });

    const countries = await (await fetch("http://localhost:3000/countries")).json();
    const select = this.closest('section').querySelector("#region-country");
    select.innerHTML = countries.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  }

  async add() {
    const name = this.closest('section').querySelector("#region-name").value;
    if (!name.trim()) {
      alert('El nombre de la región es requerido');
      return;
    }
    const countryId = parseInt(this.closest('section').querySelector("#region-country").value);
    const url = this.editingId ? `http://localhost:3000/regions/${this.editingId}` : "http://localhost:3000/regions";
    const method = this.editingId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, countryId })
    });
    this.editingId = null;
    this.load();
  }

  async remove(id) {
    await fetch(`http://localhost:3000/regions/${id}`, { method: "DELETE" });
    this.load();
  }

  async edit(id) {
    const res = await fetch(`http://localhost:3000/regions/${id}`);
    const item = await res.json();
    const nameInput = this.closest('section').querySelector("#region-name");
    const countrySelect = this.closest('section').querySelector("#region-country");
    nameInput.value = item.name;
    countrySelect.value = item.countryId;
    this.editingId = id;
  }

  cancel() {
    const nameInput = this.closest('section').querySelector("#region-name");
    const countrySelect = this.closest('section').querySelector("#region-country");
    nameInput.value = "";
    countrySelect.value = "";
    this.editingId = null;
  }


}
customElements.define("region-component", RegionComponent);
