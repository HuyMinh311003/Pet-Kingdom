import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeStyle.css";

export interface DogBreed {
    id: string;
    name: string;
    image: string;
    description: string;
}

interface DogBreedSliderProps {
    dogBreeds: DogBreed[];
}

const DogBreedSlider: React.FC<DogBreedSliderProps> = ({ dogBreeds }) => {
    const navigate = useNavigate();

    const handleBreedClick = (breed: DogBreed) => {
        navigate(`/products?category=${breed.id}&name=${breed.name}`);
    };

    return (
        <section id="dog-breeds" className="dog-breeds-section">
            <div className="section-container">
                <h2 className="section-title">Popular Dog Breeds</h2>
                <div className="breeds-grid">
                    {dogBreeds.map((breed) => (
                        <div 
                            key={breed.id} 
                            className="breed-card"
                            onClick={() => handleBreedClick(breed)}
                        >
                            <img src={breed.image} alt={breed.name} className="breed-image" />
                            <div className="breed-card-content">
                                <h3 className="breed-card-title">{breed.name}</h3>
                                <p className="breed-card-text">{breed.description}</p>
                                <button className="breed-card-button">Learn More</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <button className="breed-view-button">View All Breeds</button>
                </div>
            </div>
        </section>
    );
};

export default DogBreedSlider;