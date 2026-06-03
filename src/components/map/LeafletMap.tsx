"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Establishment, WaitLevel } from "@/types";

const WAIT_COLORS: Record<WaitLevel, string> = {
  low: "#07984a",
  mod: "#ff9300",
  high: "#ef2b24",
};

const CENTER: [number, number] = [33.5892, -7.6034]; // Casablanca Mâarif

const COORDS: Record<string, [number, number]> = {
  "1": [33.5892, -7.6034],
  "2": [33.5947, -7.6192],
  "3": [33.5788, -7.5936],
  "4": [33.5689, -7.6345],
  "5": [33.6012, -7.5876],
};

interface LeafletMapProps {
  establishments: Establishment[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function LeafletMap({ establishments, selected, onSelect }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<Record<string, import("leaflet").Marker>>({});

  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    // Dynamically import leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default icon paths
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({ iconUrl: "", shadowUrl: "" });

      const map = L.map(mapRef.current!, {
        center: CENTER,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Positron — premium minimal style, no API key
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Attribution minimal en bas à droite
      L.control.attribution({ prefix: false, position: "bottomright" }).addTo(map);

      // Zoom control en haut à droite
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstance.current = map;

      // Add markers
      establishments.forEach((e) => {
        const coords = COORDS[e.id];
        if (!coords) return;

        const color = WAIT_COLORS[e.waitLevel];
        const isSelected = selected === e.id;

        const icon = L.divIcon({
          html: `<div style="
            width:${isSelected ? 52 : 40}px;
            height:${isSelected ? 52 : 40}px;
            border-radius:50%;
            background:${color};
            border:3px solid white;
            box-shadow:0 2px 12px ${color}66,0 1px 4px rgba(0,0,0,.2);
            display:flex;
            align-items:center;
            justify-content:center;
            font-family:'Plus Jakarta Sans',sans-serif;
            font-size:11px;
            font-weight:800;
            color:white;
            transition:all .2s;
            cursor:pointer;
          ">${e.waitMinutes < 60 ? e.waitMinutes + "m" : Math.floor(e.waitMinutes / 60) + "h"}</div>`,
          className: "",
          iconSize: [isSelected ? 52 : 40, isSelected ? 52 : 40],
          iconAnchor: [isSelected ? 26 : 20, isSelected ? 26 : 20],
        });

        const marker = L.marker(coords, { icon })
          .addTo(map)
          .on("click", () => {
            onSelect(selected === e.id ? null : e.id);
          });

        markersRef.current[e.id] = marker;
      });

      return () => {
        map.remove();
        mapInstance.current = null;
      };
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fly to selected marker
  useEffect(() => {
    if (!mapInstance.current) return;
    import("leaflet").then((L) => {
      if (selected) {
        const coords = COORDS[selected];
        if (coords) {
          mapInstance.current!.flyTo([coords[0] - 0.002, coords[1]], 15, { duration: 0.8 });
        }
      }
      // Update marker sizes
      establishments.forEach((e) => {
        const marker = markersRef.current[e.id];
        const coords = COORDS[e.id];
        if (!marker || !coords) return;
        const color = WAIT_COLORS[e.waitLevel];
        const isSelected = selected === e.id;
        const icon = L.divIcon({
          html: `<div style="
            width:${isSelected ? 52 : 40}px;
            height:${isSelected ? 52 : 40}px;
            border-radius:50%;
            background:${color};
            border:3px solid white;
            box-shadow:0 2px 12px ${color}66,0 1px 4px rgba(0,0,0,.2);
            display:flex;
            align-items:center;
            justify-content:center;
            font-family:'Plus Jakarta Sans',sans-serif;
            font-size:11px;
            font-weight:800;
            color:white;
            cursor:pointer;
            transform:scale(${isSelected ? 1.15 : 1});
            transform-origin:center;
          ">${e.waitMinutes < 60 ? e.waitMinutes + "m" : Math.floor(e.waitMinutes / 60) + "h"}</div>`,
          className: "",
          iconSize: [isSelected ? 52 : 40, isSelected ? 52 : 40],
          iconAnchor: [isSelected ? 26 : 20, isSelected ? 26 : 20],
        });
        marker.setIcon(icon);
      });
    });
  }, [selected, establishments]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full"
      style={{
        background: "#e8ede9",
        backgroundImage: [
          "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "80px 80px, 80px 80px, 20px 20px, 20px 20px",
      }}
    />
  );
}
