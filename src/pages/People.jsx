/* import { Link } from "react-router-dom"; */
import { useState } from "react";
import Header from "../components/Header";
import PeopleCard from "../components/PeopleCard";
import FeedbackModal from "../components/FeedbackModal";
import "../styles/people.css";

const people = [
    {
        id: 1,
        name: "Nombre1",
        description: "Descripción personal",
        hobbies: ["Música", "Lectura"],
    },
    {
        id: 2,
        name: "Nombre2",
        description: "Me gusta conocer gente nueva",
        hobbies: ["Viajar", "Cine"],
    },
    {
        id: 3,
        name: "Nombre3",
        description: "Siempre buscando nuevas experiencias",
        hobbies: ["Deporte", "Fotografía"],
    },
];

function People() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    const currentPerson = people[currentIndex];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % people.length);
    };

    const handleMeet = () => {
        setModalOpen(true);
    };

    return (
        <main className="people-page">
            <div className="people-container">
                <Header />
                <h1 className="people-logo">Knowya</h1>

                <section className="people-content" aria-label="Descubrir personas">
                    <PeopleCard person={currentPerson} />

                    <div className="people-actions">
                        <button
                            type="button"
                            className="people-button people-button--next"
                            onClick={handleNext}
                        >
                            Next
                        </button>

                        <button
                            type="button"
                            className="people-button people-button--meet"
                            onClick={handleMeet}
                        >
                            Meet
                        </button>
                    </div>
                </section>
            </div>

            <FeedbackModal
                isOpen={modalOpen}
                type="success"
                title="Hecho!"
                message={`Has mostrado interés en ${currentPerson.name}`}
                buttonText="Entendido"
                onClose={() => setModalOpen(false)}
            />
        </main>
    );
}

export default People;