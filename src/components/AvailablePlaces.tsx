import Places from "./Places";
import { Place } from "../types";
import ErrorComponent from "./Error";
import { sortPlacesByDistance } from "../helpers/loc";
import { fetchAvailablePlaces } from "../helpers/http";
import useFetch from "../hooks/useFetch";

async function fetchSortedPlaces(): Promise<Place[]> {
  const places = await fetchAvailablePlaces();

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        places,
        position.coords.latitude,
        position.coords.longitude
      );
      resolve(sortedPlaces);
    });
  });
}

interface AvailablePlacesProps {
  onSelectPlace: (place: Place) => void;
}

export default function AvailablePlaces({
  onSelectPlace,
}: AvailablePlacesProps) {
  const {
    isFetching,
    data: availablePlaces,
    error,
  } = useFetch<Place[]>(fetchSortedPlaces, []);

  if (error) {
    return <ErrorComponent message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      onSelectPlace={onSelectPlace}
    />
  );
}
