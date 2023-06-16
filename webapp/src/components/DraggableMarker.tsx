import { Marker } from "react-leaflet"
import { useState, useRef } from "react"


  function DraggableMarker(props:{lat:number,lon:number,callback:(lat:number,lon:number) =>void}) {
    const center = {
        lat: props.lat,
        lng: props.lon,
      }
    const draggable = true;
    const [position, setPosition] = useState(center)
    const markerRef = useRef<any>(null)
    function onDrag() {
          const marker = markerRef.current
          if (marker != null) {
            setPosition(marker.getLatLng())
            props.callback(position.lat, position.lng);
          }
    }
      
  
    return (
      <Marker
        draggable={draggable}
        eventHandlers={{ dragend: onDrag }}
        position={position}
        ref={markerRef}>
      </Marker>
    )
  }
  
  export default DraggableMarker;