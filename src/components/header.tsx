import nlwUniteIcon from "../assets/nwl-unite-icon.svg";
import { NavLink } from "./nav-link";

export function Header() {
  return (
    <div className="flex items-center gap-5 py-2">
      <img
        src={nlwUniteIcon}
        alt="logo of the nlw-unite"
        className="cursor-pointer"
      />
      <nav className="flex items-center gap-5">
        {/* <a href="#" className="font-medium text-sm text-zinc-300">
          Eventos
        </a>
        <a href="#" className="font-medium text-sm text-zinc-300">
          Participantes
        </a> */}
        <NavLink href="/events">Events</NavLink>

        <NavLink href="/attendees">Attendees</NavLink>
      </nav>
    </div>
  );
}
