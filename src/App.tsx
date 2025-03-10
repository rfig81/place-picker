import { useRef, useState, useEffect, useCallback } from "react";

import Places from "./components/Places";
import { AVAILABLE_PLACES } from "./data";
import Modal from "./components/Modal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import logoImg from "./assets/logo.png";

import { Place } from "./types";
import { sortPlacesByDistance } from "./helpers/loc";
import { getStoredPlaces } from "./helpers/localPlaces";

const storedPlaces = getStoredPlaces();

function App() {
  const selectedPlace = useRef("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickedPlaces, setPickedPlaces] = useState<Place[]>(storedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        coords.latitude,
        coords.longitude
      );

      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id: string) {
    setIsModalOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsModalOpen(false);
  }

  function handleSelectPlace(id: string) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return place ? [place, ...prevPickedPlaces] : prevPickedPlaces;
    });

    //Update local storage
    const storedIds = JSON.parse(
      localStorage.getItem("selectedPlaces") || "[]"
    ) as string[];
    console.log({ storedIds });
    if (storedIds.indexOf(id) === -1)
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIds])
      );
  }

  const handleRemovePlace = useCallback(() => {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setIsModalOpen(false);

    //Update local storage
    const storedIds = JSON.parse(
      localStorage.getItem("selectedPlaces") || "[]"
    ) as string[];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }, []);

  return (
    <>
      <Modal open={isModalOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          fallbackText="Sorting places by distance..."
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
