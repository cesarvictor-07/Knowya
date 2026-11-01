import { UserRound } from "lucide-react";
import "../styles/people-card.css";

function PeopleCard({ person }) {
  return (
    <article className="people-card">
      <div className="people-card-photo">
        {person.image ? (
          <img src={person.image} alt={`Perfil de ${person.name}`} />
        ) : (
          <div className="people-card-placeholder">
            <UserRound aria-hidden="true" />
            <span>Foto de perfil</span>
          </div>
        )}
      </div>

      <div className="people-card-information">
        <h2>{person.name}</h2>

        <p className="people-card-description">
          {person.description}
        </p>

        <div className="people-card-hobbies">
          <h3>Hobbies</h3>
          <p>{person.hobbies.join(" · ")}</p>
        </div>
      </div>
    </article>
  );
}

export default PeopleCard;
