<script>
    import { page } from '$app/stores';
    
    // Get user data from page data
    $: user = $page.data.user;
</script>

<div class="admin-container">
    <div class="admin-header">
        <h1>DASHBOARD ADMIN</h1>
        <form method="POST" action="/logout" class="logout-form">
            <button type="submit" class="logout-btn">SAIR</button>
        </form>
    </div>
    
    {#if user}
        <div class="welcome-card">
            <h2>BEM-VINDO, {user.name.toUpperCase()}</h2>
            <p>Tipo: <strong>ADMINISTRADOR</strong></p>
        </div>
    {/if}
    
    <div class="dashboard-grid">
        <a href="/admin/users" class="dashboard-card">
            <h3>USUÁRIOS</h3>
            <p>Gerenciar usuários do sistema</p>
        </a>
        
        <a href="/admin/trainings" class="dashboard-card">
            <h3>TREINAMENTOS</h3>
            <p>Gerenciar arquivos e acessos</p>
        </a>
        
        <a href="/admin/payments" class="dashboard-card">
            <h3>PAGAMENTOS</h3>
            <p>Verificar pagamentos pendentes</p>
        </a>
    </div>
</div>

<style>
    .admin-container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        border-bottom: 3px solid #000;
        padding-bottom: 15px;
    }
    
    h1 {
        margin: 0;
        font-size: 2rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .logout-form {
        margin: 0;
    }
    
    .logout-btn {
        padding: 8px 16px;
        background: #000;
        color: #fff;
        border: 2px solid #000;
        font-weight: bold;
        text-transform: uppercase;
        cursor: pointer;
    }
    
    .logout-btn:hover {
        background: #fff;
        color: #000;
    }
    
    .welcome-card {
        border: 3px solid #000;
        padding: 20px;
        margin-bottom: 30px;
        background: #f9f9f9;
        text-align: center;
    }
    
    .welcome-card h2 {
        margin: 0 0 10px 0;
        font-size: 1.5rem;
    }
    
    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
    }
    
    .dashboard-card {
        border: 3px solid #000;
        padding: 30px 20px;
        background: #fff;
        text-decoration: none;
        color: #000;
        text-align: center;
        transition: all 0.2s;
    }
    
    .dashboard-card:hover {
        background: #000;
        color: #fff;
    }
    
    .dashboard-card h3 {
        margin: 0 0 10px 0;
        font-size: 1.3rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .dashboard-card p {
        margin: 0;
        font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
        .admin-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
        }
        
        .dashboard-grid {
            grid-template-columns: 1fr;
        }
        
        h1 {
            font-size: 1.5rem;
        }
    }
</style>
