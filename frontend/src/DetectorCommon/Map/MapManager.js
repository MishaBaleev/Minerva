import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

export class MapManager{
    constructor(){
        const token = "pk.eyJ1IjoiYmFsZWV2IiwiYSI6ImNsYXBqNmk4dTE5Y3UzcWxiYmt1bTJtcG8ifQ.aE8lRdfDnWq52szIP7gAHw"
        mapboxgl.accessToken = token;
        this.interactive = false
        this.map = new mapboxgl.Map({
            container: "map",
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [37.617734, 55.752004],
            zoom: 15,
            minZoom: 2
        })
        this.azimuth = 0
        this.marker = null
        this.sector = null 
        this.map.on("click", (e) => {this.mapClick(e)})

        this.toggleInteractive(false)
    }

    toggleInteractive(value){
        this.interactive = value
        if (value){
            this.map.boxZoom.enable();
            // this.map.scrollZoom.enable();
            this.map.dragPan.enable();
            this.map.dragRotate.enable();
            this.map.keyboard.enable();
            this.map.doubleClickZoom.enable();
            this.map.touchZoomRotate.enable();
        }else{
            this.map.boxZoom.disable();
            // this.map.scrollZoom.disable();
            this.map.dragPan.disable();
            this.map.dragRotate.disable();
            this.map.keyboard.disable();
            this.map.doubleClickZoom.disable();
            this.map.touchZoomRotate.disable();
        }
    }

    mapClick(e){
        if (this.interactive){
            this.setAngle({x: e.lngLat.lng, y: e.lngLat.lat})
        }
    }

    rotateSector(angle){
        this.azimuth = Number(angle)
        if (this.marker){
            let geojson = this.createGeoJSONCircle([this.marker.getLngLat().lng, this.marker.getLngLat().lat], 1, 120, Number(-angle)+90, true)
            this.map.getSource("sector_source").setData(geojson)
        }
    }

    createGeoJSONCircle(center, radius, angle, vector, is_update=false) {
        let coords = {
            latitude: center[1],
            longitude: center[0]
        };
        let km = radius;
        let ret = [];
        let distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
        let distanceY = km/110.574;
        let theta, x, y;
        for(let i = (vector - angle / 2); i < (vector + angle / 2); i = i + 1) {
            theta = (i/360)*(2*Math.PI);
            x = distanceX*Math.cos(theta);
            y = distanceY*Math.sin(theta);
            ret.push([coords.longitude+x, coords.latitude+y]);
        }
        ret.push(center)
        ret.unshift(center)
        if (is_update){
            return {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "properties": {"name": "sector"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [ret]
                    }
                }]
            }
        }else{
            return {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [ret]
                        }
                    }]
                }
            };
        }
    };

    setAngle(params){
        if (this.marker != null){
            this.marker.remove()
            this.marker = null
            this.map.removeLayer("sector_layer")
            this.map.removeSource("sector_source")
        }
        this.marker = new mapboxgl.Marker({
            "color": "#02D402"
        }).setLngLat([params.x, params.y]).addTo(this.map)
        this.map.addSource("sector_source", this.createGeoJSONCircle([params.x, params.y], 1, 120, -this.azimuth+90))
        this.map.addLayer({
            "id": "sector_layer",
            "type": "fill",
            "source": "sector_source",
            "layout": {},
            "paint": {
                "fill-color": "#02d402",
                "fill-opacity": 0.4
            }
        })
        this.map.flyTo({center: [params.x, params.y]})
    }

    clear(){
        this.marker.remove()
        this.marker = null
        this.map.removeLayer("sector_layer")
        this.map.removeSource("sector_source")
    }

    warning(){
        if (this.marker){
            this.map.setPaintProperty("sector_layer", "fill-color", "#ff0000")
        }
    }
}