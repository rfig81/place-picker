import { AVAILABLE_PLACES } from "../data";
import { Place } from "../types";

export function getStoredPlaces() {
  const storedIds = JSON.parse(
    localStorage.getItem("selectedPlaces") || "[]"
  ) as string[];

  return storedIds.map(
    (id) => AVAILABLE_PLACES.find((place) => place.id === id) as Place
  );
}
