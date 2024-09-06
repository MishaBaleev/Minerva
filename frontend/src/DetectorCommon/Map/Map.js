import { useState, useEffect } from "react";
import { MapManager } from "./MapManager";
import MapInput from "./MapInput";

const Map = (props) => {
    const [mapManager, setMapManager] = useState(null)
    const [map_mode, setMapMode] = useState(false)

    useEffect(() => {
        let manager = new MapManager()
        console.log(manager)
        setMapManager(manager)
    }, [])
    const changeMapMode = () => {
        if (map_mode){
            setMapMode(false)
            mapManager.toggleInteractive(false)
        }else{
            setMapMode(true)
            mapManager.toggleInteractive(true)
        }
    }
    const setDevice = (params) => {mapManager.setAngle(params)}

    return <div className="map">
        <MapInput
            map_mode={map_mode}
            setDevice={setDevice}
            changeMapMode={changeMapMode}
            mapManager={mapManager}
            updateModal={props.updateModal}
        />
        <div id="map"/>
    </div>
}

export default Map