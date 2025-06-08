import { NavLink, useNavigate } from 'react-router'
import logo from '../../assets/headerLogo.svg'
import { useUser } from '../../contexts/AuthContext'

export function Header() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    navigate("/");
  }

  return (
    <div className="h-20 bg-zinc-800 w-full flex justify-between items-center flex-row m-0 p-0">
      <div className="h-20 w-full flex gap-8 items-center flex-row m-0 p-0">
        <img src={logo} alt="Logo do projeto ludico" className='h-16 mx-6' />
        {user?.role > 2 &&
          <NavLink
            to="/Admin"
            className={({ isActive }) =>
              `text-3xl ${isActive ? 'text-amber-400 font-bold' : 'text-zinc-50 hover:scale-110 hover:opacity-70 transition-transform duration-300'}`
            }
          >
            Painel Administrativo
          </NavLink>
        }
      </div >
      <div className="h-20 w-full flex gap-8 items-center flex-row m-0 p-0">
        <NavLink
          to="/Ceremony"
          className={({ isActive }) =>
            `text-3xl ${isActive ? 'text-amber-400 font-bold' : 'text-zinc-50 hover:scale-110 hover:opacity-70 transition-transform duration-300'}`
          }
        >
          Eventos
        </NavLink>
        <NavLink
          to="/Scape"
          className={({ isActive }) =>
            `text-3xl ${isActive ? 'text-amber-400 font-bold' : 'text-zinc-50 hover:scale-110 hover:opacity-70 transition-transform duration-300'}`
          }
        >
          Escape
        </NavLink>
        <NavLink
          to="/RPG"
          className={({ isActive }) =>
            `text-3xl ${isActive ? 'text-amber-400 font-bold' : 'text-zinc-50 hover:scale-110 hover:opacity-70 transition-transform duration-300'}`
          }
        >
          RPG
        </NavLink>
        <NavLink
          to="/BoardGame"
          className={({ isActive }) =>
            `text-3xl ${isActive ? 'text-amber-400 font-bold' : 'text-zinc-50 hover:scale-110 hover:opacity-70 transition-transform duration-300'}`
          }
        >
          BoardGame
        </NavLink>
        <button
          className="text-3xl text-zinc-50 hover:scale-110 hover:opacity-70 transition-transform duration-300"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div >
  )
}