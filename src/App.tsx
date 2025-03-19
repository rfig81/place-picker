import { useRef, useState, useCallback } from "react";

import Places from "./components/Places";
import Modal from "./components/Modal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces";
import { fetchUserPlaces, updateUserPlaces } from "./helpers/http";
import { Place } from "./types";
import ErrorComponent from "./components/Error";
import tryCatch from "./helpers/tryCatch";
import useFetch from "./hooks/useFetch";

function App() {
  const selectedPlace = useRef<Place>(null);

  const [errorUpdating, setErrorUpdating] = useState<Error | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isFetching,
    data: userPlaces,
    error: errorFetchingPlaces,
    setData: setUserPlaces,
  } = useFetch<Place[]>(fetchUserPlaces, []);

  function handleStartRemovePlace(place: Place) {
    setIsModalOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setIsModalOpen(false);
  }

  async function handleSelectPlace(selectedPlace: Place) {
    if (userPlaces.some((place) => place.id === selectedPlace.id)) return;

    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    const { error } = await tryCatch(
      updateUserPlaces([selectedPlace, ...userPlaces])
    );

    if (error) {
      setUserPlaces(userPlaces);
      setErrorUpdating(error);
    }
  }

  const handleRemovePlace = useCallback(async () => {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter(
        (place) =>
          selectedPlace.current && place.id !== selectedPlace.current.id
      )
    );

    const { error } = await tryCatch(
      updateUserPlaces(
        userPlaces.filter(
          (place) =>
            selectedPlace.current && place.id !== selectedPlace.current.id
        )
      )
    );

    if (error) {
      setUserPlaces(userPlaces);
      setErrorUpdating(error);
    }

    setIsModalOpen(false);
  }, [userPlaces, setUserPlaces]);

  function handleError() {
    setErrorUpdating(null);
  }

  return (
    <>
      <Modal open={errorUpdating !== null} onClose={handleError}>
        <ErrorComponent message={errorUpdating?.message as string} />
      </Modal>
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
        {errorFetchingPlaces && (
          <ErrorComponent message={errorFetchingPlaces.message} />
        )}
        {!errorFetchingPlaces && (
          <Places
            title="I'd like to visit ..."
            places={userPlaces}
            isLoading={isFetching}
            loadingText="Fetching your places..."
            fallbackText="Select the places you would like to visit below."
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
