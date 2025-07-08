<script>
  export let form;
</script>

<div class="admin-dashboard">
  <h1>Novo Treinamento</h1>
  {#if form?.success}
    <div class="success">{form.success}</div>
  {/if}
  {#if form?.error}
    <div class="error">{form.error}</div>
  {/if}
  <form method="POST" enctype="multipart/form-data">
    <label>Nome do treinamento:<br/>
      <input type="text" name="name" required />
    </label>
    <br/><br/>
    <label>Arquivo:<br/>
      <input type="file" name="file" required />
    </label>
    <br/><br/>
    <label>Acesso:<br/>
      <select name="access_type">
        <option value="everyone">Todos</option>
        <option value="group">Grupo</option>
        <option value="user">Usuário</option>
      </select>
    </label>
    <br/><br/>
    <label>Conteúdo avançado (JSON, TOML, YAML, etc):<br/>
      <textarea name="advanced_content" rows="10" placeholder="Cole aqui seu conteúdo .json, .toml, .yaml, etc" style="font-family:monospace; width:100%; resize:vertical;"></textarea>
      <small>Suporta sintaxes como JSON, TOML, YAML, Markdown, etc.</small>
    </label>
    <br/><br/>
    <button type="submit">Salvar</button>
  </form>
</div>

<style>
.admin-dashboard {
  max-width: 480px;
  margin: 32px auto;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  text-align: center;
}
.admin-dashboard h1 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
form label {
  display: block;
  margin-bottom: 1rem;
  text-align: left;
}
input, select, button {
  width: 100%;
  padding: 0.7rem;
  margin-top: 0.3rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}
button {
  background: #000;
  color: #fff;
  border: 2px solid #000;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 1rem;
}
button:hover {
  background: #fff;
  color: #000;
}
.success {
  background: #e6ffe6;
  color: #006600;
  border-radius: 6px;
  padding: 0.7rem;
  margin-bottom: 1rem;
}
.error {
  background: #ffe6e6;
  color: #a00;
  border-radius: 6px;
  padding: 0.7rem;
  margin-bottom: 1rem;
}
@media (max-width: 600px) {
  .admin-dashboard {
    padding: 8px;
    max-width: 98vw;
  }
}
</style>
