
import { UserRound } from "lucide-react";
import "../styles/people-card.css";

function PeopleCard({ person }) {
  return (
    <article className="people-card">
      <div className="people-card-photo">
        <div className="people-card-placeholder">
          <UserRound aria-hidden="true" />
          <span>Foto de perfil</span>
        </div>
      </div>

      <div className="people-card-information">
        <h2>{person.userName}</h2>

        <p className="people-card-description">
          {person.descripcion || "Este usuario todavía no ha añadido una descripción."}
        </p>
      </div>
    </article>
  );
}

export default PeopleCard;
