import { Link } from 'react-router-dom';

import './CompCss/Header.css';

function Header() {
	return (
		<header>
			<nav>	
				<ul>
				<li><Link to="/">Home</Link></li>
                    <li><Link to="/form-pet">Cadastro de Pets</Link></li>
                    <li><Link to="/form-users">Cadastro de Usuários</Link></li>
                    <li><Link to="/list-pet">Consulta Pets</Link></li>
                    <li><Link to="/list-users">Consulta Usuários</Link></li>
                    <li><Link to="/contact">Contato</Link></li>
                                                           
				</ul>
			</nav>	
		</header>
	);
}

export default Header;
