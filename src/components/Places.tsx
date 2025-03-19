import { Place } from "../types";
import { API_URL } from "../config";
interface PlacesProps {
  title: string;
  places: Place[];
  isLoading?: boolean;
  loadingText?: string;
  fallbackText?: string;
  onSelectPlace: (place: Place) => void;
}

export default function Places({
  title,
  places,
  isLoading,
  loadingText = "Fetching place data...",
  fallbackText = "No places available.",
  onSelectPlace,
}: PlacesProps) {
  const renderLoading = () => <p className="fallback-text">{loadingText}</p>;

  const renderFallbackText = () =>
    places.length === 0 && <p className="fallback-text">{fallbackText}</p>;

  const renderPlacesList = () =>
    places.length > 0 && (
      <ul className="places">
        {places.map((place) => (
          <li key={place.id} className="place-item">
            <button onClick={() => onSelectPlace(place)}>
              <img
                src={`${API_URL}/${place.image.src}`}
                alt={place.image.alt}
              />
              <h3>{place.title}</h3>
            </button>
          </li>
        ))}
      </ul>
    );

  return (
    <section className="places-category">
      <h2>{title}</h2>
      {isLoading ? (
        renderLoading()
      ) : (
        <>
          {renderFallbackText()}
          {renderPlacesList()}
        </>
      )}
    </section>
  );
}
