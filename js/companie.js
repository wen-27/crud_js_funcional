class CompanyComponent extends HTMLElement {
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
    const res = await fetch("http://localhost:3000/companies?_expand=city");
    const data = await res.json();
    const tbody = this.closest('section').querySelector('tbody');
    tbody.innerHTML = "";
    data.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.phone || ""}</td>
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
    this.closest('section').querySelector("#company-city").innerHTML =
      cities.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  }

  async add() {
    const name = this.closest('section').querySelector("#company-name").value;
    if (!name.trim()) {
      alert('El nombre de la compañía es requerido');
      return;
    }
    const UKNiu = this.closest('section').querySelector("#company-ukniu").value;
    if (!UKNiu.trim()) {
      alert('El UKNiu es requerido');
      return;
    }
    const address = this.closest('section').querySelector("#company-address").value;
    if (!address.trim()) {
      alert('La dirección es requerida');
      return;
    }
    const email = this.closest('section').querySelector("#company-email").value;
    if (!email.trim()) {
      alert('El email es requerido');
      return;
    }
    const phone = this.closest('section').querySelector("#company-phone").value;
    if (!phone.trim()) {
      alert('El teléfono es requerido');
      return;
    }
    const cityId = parseInt(this.closest('section').querySelector("#company-city").value);

    const url = this.editingId ? `http://localhost:3000/companies/${this.editingId}` : "http://localhost:3000/companies";
    const method = this.editingId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, UKNiu, address, cityId, email, phone })
    });
    this.editingId = null;
    this.load();
  }

  async remove(id) {
    await fetch(`http://localhost:3000/companies/${id}`, { method: "DELETE" });
    this.load();
  }

  async edit(id) {
    const res = await fetch(`http://localhost:3000/companies/${id}`);
    const item = await res.json();
    this.closest('section').querySelector("#company-name").value = item.name;
    this.closest('section').querySelector("#company-ukniu").value = item.UKNiu;
    this.closest('section').querySelector("#company-address").value = item.address;
    this.closest('section').querySelector("#company-email").value = item.email;
    this.closest('section').querySelector("#company-phone").value = item.phone;
    this.closest('section').querySelector("#company-city").value = item.cityId;
    this.editingId = id;
  }

  cancel() {
    this.closest('section').querySelector("#company-name").value = "";
    this.closest('section').querySelector("#company-ukniu").value = "";
    this.closest('section').querySelector("#company-address").value = "";
    this.closest('section').querySelector("#company-email").value = "";
    this.closest('section').querySelector("#company-phone").value = "";
    this.closest('section').querySelector("#company-city").value = "";
    this.editingId = null;
  }

  disconnectedCallback() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }


}
customElements.define("companie-component", CompanyComponent);
