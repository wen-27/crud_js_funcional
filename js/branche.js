class BranchComponent extends HTMLElement {
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
    const res = await fetch("http://localhost:3000/branches?_expand=city&_expand=company");
    const data = await res.json();
    const tbody = this.closest('section').querySelector('tbody');
    tbody.innerHTML = "";
    data.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.number_comercial}</td>
            <td>${item.name_comercial || ""}</td>
            <td>${item.address}</td>
            <td>${item.email}</td>
            <td>${item.phone}</td>
            <td>${item.city?.name || ""}</td>
            <td>${item.company?.name || ""}</td>
            <td>
              <button class="btn btn-editar">Editar</button>
              <button class="btn btn-eliminar">Eliminar</button>
            </td>
        `;
      tr.querySelector('.btn-eliminar').onclick = () => this.remove(item.id);
      tr.querySelector('.btn-editar').onclick = () => this.edit(item.id);
      tbody.appendChild(tr);
    });

    const cities = await (await fetch("http://localhost:3000/cities")).json();
    this.closest('section').querySelector("#branch-city").innerHTML =
      cities.map(c => `<option value="${c.id}">${c.name}</option>`).join("");

    const companies = await (await fetch("http://localhost:3000/companies")).json();
    this.closest('section').querySelector("#branch-company").innerHTML =
      companies.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  }

  async add() {
    const number_comercial = this.closest('section').querySelector("#branch-number").value;
    if (!number_comercial.trim()) {
      alert('El número es requerido');
      return;
    }
    const name_comercial = this.closest('section').querySelector("#branch-name").value;
    if (!name_comercial.trim()) {
      alert('El nombre comercial es requerido');
      return;
    }
    const address = this.closest('section').querySelector("#branch-address").value;
    if (!address.trim()) {
      alert('La dirección es requerida');
      return;
    }
    const email = this.closest('section').querySelector("#branch-email").value;
    if (!email.trim()) {
      alert('El email es requerido');
      return;
    }
    const phone = this.closest('section').querySelector("#branch-phone").value;
    if (!phone.trim()) {
      alert('El teléfono es requerido');
      return;
    }
    const cityId = parseInt(this.closest('section').querySelector("#branch-city").value);
    const companyId = parseInt(this.closest('section').querySelector("#branch-company").value);

    const url = this.editingId ? `http://localhost:3000/branches/${this.editingId}` : "http://localhost:3000/branches";
    const method = this.editingId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number_comercial, name_comercial, address, email, phone, cityId, companyId })
    });
    this.editingId = null;
    this.load();
  }

  async remove(id) {
    await fetch(`http://localhost:3000/branches/${id}`, { method: "DELETE" });
    this.load();
  }

  async edit(id) {
    const res = await fetch(`http://localhost:3000/branches/${id}`);
    const item = await res.json();
    this.closest('section').querySelector("#branch-number").value = item.number_comercial;
    this.closest('section').querySelector("#branch-name").value = item.name_comercial;
    this.closest('section').querySelector("#branch-address").value = item.address;
    this.closest('section').querySelector("#branch-email").value = item.email;
    this.closest('section').querySelector("#branch-phone").value = item.phone;
    this.closest('section').querySelector("#branch-city").value = item.cityId;
    this.closest('section').querySelector("#branch-company").value = item.companyId;
    this.editingId = id;
  }

  cancel() {
    this.closest('section').querySelector("#branch-number").value = "";
    this.closest('section').querySelector("#branch-name").value = "";
    this.closest('section').querySelector("#branch-address").value = "";
    this.closest('section').querySelector("#branch-email").value = "";
    this.closest('section').querySelector("#branch-phone").value = "";
    this.closest('section').querySelector("#branch-city").value = "";
    this.closest('section').querySelector("#branch-company").value = "";
    this.editingId = null;
  }

  disconnectedCallback() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <h2>Branches</h2>
      <form>
        <input id="number" placeholder="Number" />
        <input id="address" placeholder="Address" />
        <input id="email" placeholder="Email" />
        <input id="contact" placeholder="Contact name" />
        <input id="phone" placeholder="Phone" />
        <select id="city"></select>
        <select id="company"></select>
        <button>Add</button>
      </form>
      <ul id="list"></ul>
    `;
  }
}
customElements.define("branch-component", BranchComponent);
