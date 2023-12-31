import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Icon from './images/Icon.PNG';
import { AuthContext } from '../../AuthContext';
import { logout } from '../../AuthService';
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  
  const handleLogout = async () => {
    await logout();
    navigate('/'); 
  };
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <img src={Icon} alt="Your Company Icon" width="50" height="50" className="d-inline-block align-top" />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/listHus">
              List House
            </NavLink>
          </li>

          {user && user.role === 'Admin' && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/husTabell">
                  Houses
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/kundeTabell">
                  Customers
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/eierTabell">
                  Owners
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/ordreTabell">
                  Orders
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/personTabell">
                  Persons
                </NavLink>
              </li>
            </>
          )}
        </ul>
            <div className="d-flex">
            {user && user.isAuthenticated ? (
    <>
        <NavLink className="nav-link text-white me-2" to="/Innlogging/MyProfile">
            My Profile
        </NavLink>
        <NavLink className="nav-link text-white me-2" onClick={handleLogout}>
            Log Out
        </NavLink>
    </>
) : (
    <>
        <NavLink className="nav-link text-white me-2" to="/Innlogging/Register">
            Register
        </NavLink>
        <NavLink className="nav-link text-white me-2" to="/Innlogging/LoggInn">
            Login
        </NavLink>
    </>
)}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
