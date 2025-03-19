import { API_URL } from "../config";
import { Place } from "../types";

export async function fetchAvailablePlaces() {
  const response = await fetch(`${API_URL}/places`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch places");
  }

  return data.places;
}

export async function fetchUserPlaces() {
  const response = await fetch(`${API_URL}/user-places`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch user places");
  }

  return data.places;
}

export async function updateUserPlaces(places: Place[]) {
  const response = await fetch(`${API_URL}/user-places`, {
    method: "PUT",
    body: JSON.stringify({ places }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to update user places");
  }

  return data.message as string;
}
