import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import cx from "classnames";
import { Spinner } from "@components/component";

// đã truyền đủ thông số valid cho marker
const MarkerAddress = ({ latlong, address }) => {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const lat = parseFloat(latlong[0]);
    const lon = parseFloat(latlong[1]);

    if (!mapRef.current) {
      const map = L.map("map").setView([lat, lon], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;
    } else {
      mapRef.current.setView([lat, lon], 15);
    }

    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        mapRef.current.removeLayer(layer);
      }
    });

    L.marker([lat, lon])
      .addTo(mapRef.current)
      .bindPopup(`${address}`)
      .openPopup();

    L.circle([lat, lon], {
      color: "red",
      radius: 300,
    }).addTo(mapRef.current);
  }, [latlong, address]);

  return (
    <div
      id="map"
      className={cx("leaflet_map")}
      style={{
        width: "100%",
        height: "250px",
        borderRadius: "5px",
        boxShadow: "1px 2px 4px #7e7e7e",
      }}
    ></div>
  );
};

export default MarkerAddress;
