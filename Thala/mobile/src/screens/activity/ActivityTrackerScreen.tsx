import React from "react";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet } from "react-native";
import type { RoutePoint } from "@/types/models";

type Props = {
  points: RoutePoint[];
  colors: any;
  mapRef: any;
};

export default function NativeMap({ points, colors, mapRef }: Props) {
  const lastPoint = points[points.length - 1];

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      provider={PROVIDER_GOOGLE}
      showsUserLocation
      initialRegion={{
        latitude: lastPoint?.latitude ?? 18.5204,
        longitude: lastPoint?.longitude ?? 73.8567,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {points.length > 1 && (
        <Polyline
          coordinates={points}
          strokeColor={colors.primary}
          strokeWidth={5}
        />
      )}

      {lastPoint && <Marker coordinate={lastPoint} />}
    </MapView>
  );
}
