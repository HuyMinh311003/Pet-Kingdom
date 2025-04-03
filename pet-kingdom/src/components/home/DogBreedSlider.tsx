import React from "react";
import "./HomeStyle.css";

export interface DogBreed {
    name: string;
    image: string;
    description: string;
}

interface DogBreedSliderProps {
    dogBreeds: DogBreed[];
}

const DogBreedSlider: React.FC<DogBreedSliderProps> = ({ dogBreeds }) => {
    return (
        <section id="breeds-section" className="dog-breed-section">
            <div className="section-container">
                <h2 className="section-title">Popular Dog Breeds</h2>
                <div className="breed-grid">
                    {dogBreeds.map((breed, index) => (
                        <div key={index} className="breed-card">
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