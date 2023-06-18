import { Marker } from "react-leaflet"
import { useState, useRef } from "react"


  function MarkerToMove(props:{callback:(lat:number,lon:number) =>void}) {
    const center = {
        lat: 50.85119149087381,
        lng: 4.3544687591272835,
      }
    const draggable = true;
    const [position, setPosition] = useState(center)
    const markerRef = useRef<any>([center.lat,center.lng])
    async function onDrag() {
          const marker = markerRef.current
          if (marker != null) {
            setPosition(marker.getLatLng())
            props.callback(position.lat, position.lng);
          }
    }
      
  
    return (
      <Marker
        draggable={draggable}
        eventHandlers={{ drag: onDrag }}
        position={position}
        ref={markerRef}>
      </Marker>
    )
  }
  
  export default MarkerToMove;