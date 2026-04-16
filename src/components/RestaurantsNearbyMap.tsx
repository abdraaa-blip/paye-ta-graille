"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import type { CSSProperties } from "react";

const mapContainerStyle: CSSProperties = {
  width: "100%",
  height: "min(320px, 55vh)",
  borderRadius: "8px",
};

export type MapPlaceRow = {
  place_id: string;
  name: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
};

type Props = {
  places: MapPlaceRow[];
  onPick: (p: MapPlaceRow) => void;
};

export function RestaurantsNearbyMap({ places, onPick }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
  const withGeo = places.filter(
    (p): p is MapPlaceRow & { lat: number; lng: number } =>
      typeof p.lat === "number" &&
      typeof p.lng === "number" &&
      Number.isFinite(p.lat) &&
      Number.isFinite(p.lng),
  );

  const { isLoaded, loadError } = useJsApiLoader({
    id: "ptg-google-map-script",
    googleMapsApiKey: apiKey,
    language: "fr",
    region: "FR",
  });

  if (!apiKey) {
    return (
      <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-sm)", color: "var(--ptg-text-muted)" }}>
        La carte s’affichera ici quand elle sera activée sur l’app. En attendant, la liste au-dessus suffit pour choisir un lieu.
      </p>
    );
  }

  if (loadError) {
    return (
      <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-sm)" }} role="alert">
        La carte ne peut pas se charger pour l’instant. Tu peux quand même choisir un lieu dans la liste.
      </p>
    );
  }

  if (!isLoaded) {
    return (
      <p className="ptg-type-body" style={{ margin: "0 0 0.75rem", fontSize: "var(--ptg-text-sm)" }} aria-live="polite">
        Chargement de la carte…
      </p>
    );
  }

  if (withGeo.length === 0) {
    return null;
  }

  const defaultCenter = { lat: withGeo[0].lat, lng: withGeo[0].lng };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <p style={{ margin: "0 0 0.5rem", fontSize: "var(--ptg-text-sm)", fontWeight: 600 }}>Carte</p>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={14}
        onLoad={(map) => {
          if (withGeo.length === 1) {
            map.setCenter({ lat: withGeo[0].lat, lng: withGeo[0].lng });
            map.setZoom(15);
            return;
          }
          const bounds = new google.maps.LatLngBounds();
          for (const p of withGeo) {
            bounds.extend({ lat: p.lat, lng: p.lng });
          }
          map.fitBounds(bounds, 56);
        }}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {withGeo.map((p) => {
          const row: MapPlaceRow = {
            place_id: p.place_id,
            name: p.name,
            address: p.address,
            lat: p.lat,
            lng: p.lng,
          };
          return (
            <Marker
              key={p.place_id}
              position={{ lat: p.lat, lng: p.lng }}
              title={p.name}
              onClick={() => onPick(row)}
            />
          );
        })}
      </GoogleMap>
      <p
        className="ptg-type-body"
        style={{ margin: "0.35rem 0 0", fontSize: "var(--ptg-text-xs)", color: "var(--ptg-text-muted)" }}
      >
        Clique un marqueur pour pré-remplir le formulaire (comme la liste).
      </p>
    </div>
  );
}
