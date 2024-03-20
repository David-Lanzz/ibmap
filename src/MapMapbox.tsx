import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './mapboxDesign.css';
import { SearchBox, AddressAutofill } from '@mapbox/search-js-react';

interface MapMapboxProps {
    // Add any props you need for your component here
}

const MapMapbox: React.FC<MapMapboxProps> = () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibW9obzAxMCIsImEiOiJjbHRpZnhkMHYwZDZ4MmtwaG1rOW5rZ3g2In0.GKJTYFiJdhfQ6X4ka-Wl4g';

    const mapContainer = useRef(null as any);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState(3.9470);
    const [lat, setLat] = useState(7.3775);
    const [zoom, setZoom] = useState(8);
    const [mapStyleLayerId, setMapStyleLayerId] = useState('streets');
    const [searchValue, setSearchValue] = useState('');
    const [markerInfo, setMarkerInfo] = useState<string>('');

    useEffect(() => {
        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: zoom
            });

            map.current.on('load', () => {
                // Define the boundaries of Ibadan, Nigeria
                const ibadanBounds = [
                    [3.7746, 7.0236], // Southwest coordinates
                    [3.9406, 7.6191]  // Northeast coordinates
                ];

                // Fit the map's viewport to the boundaries of Ibadan, Nigeria
                map.current!.fitBounds(ibadanBounds, { padding: 20 });
            });

            map.current.on('move', () => {
                setZoom(map.current!.getZoom().toFixed(2));
            });

            map.current.on('mousemove', (e: any) => {
                setLng(e.lngLat.lng.toFixed(4));
                setLat(e.lngLat.lat.toFixed(4));
            });
        }
    }, []);

    useEffect(() => {
        if (map.current) {
            map.current.setStyle('mapbox://styles/mapbox/' + mapStyleLayerId);
        }
    }, [mapStyleLayerId]);

    const handleSearchRetrieve = (e: any) => {
        const coordinates = e.features[0]?.geometry.coordinates;
        if (coordinates) {
            setLng(coordinates[0]);
            setLat(coordinates[1]);
            if (map.current) {
                map.current.setCenter(coordinates);
                map.current.setZoom(10);
                // Add marker
                const marker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map.current);
                // Get marker info
                console.log(e.features[0].properties)
                const info = `Name: ${e.features[0]?.properties?.full_address}\nLatitude: ${coordinates[1]}\nLongitude: ${coordinates[0]}`;
                setMarkerInfo(info);
            }
        }
        setSearchValue(e.query || '');
    };

    const handleDownloadMarkerInfo = () => {
        // Create a blob with marker info
        const blob = new Blob([markerInfo], { type: 'text/plain' });
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'marker_info.txt');
        // Append link to DOM and trigger download
        document.body.appendChild(link);
        link.click();
        // Cleanup
        document.body.removeChild(link);
    };

    return (
        <div className='flex flex-col relative w-full border-2 mx-2'>
            <div className="sidebar flex-col gap-1">
                <div className='flex w-full h-full'>Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>
                <div className='flex w-full h-full'>
                    <select title='selectMapStyleDropDown' name='selectMapStyle' className=' flex rounded-md p-1 items-center justify-center' value={mapStyleLayerId} onChange={(e) => setMapStyleLayerId(e.target.value)}>
                        <option value="streets-v11">Streets</option>
                        <option value="outdoors-v12">Outdoors</option>
                        <option value="light-v11">Light</option>
                        <option value="dark-v10">Dark</option>
                        <option value="satellite-streets-v12">Satellite with Streets</option>
                        <option value="standard-v12">Standard</option>
                    </select>
                </div>
            </div>
            <div className='sidebar-right'>
                <SearchBox
                    accessToken={mapboxgl.accessToken}
                    placeholder='Address'
                    value={searchValue}
                    onRetrieve={handleSearchRetrieve}
                />
            </div>
            <div ref={mapContainer} className="map-container h-screen" />
            <button className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={handleDownloadMarkerInfo}>Download Marker Info</button>
        </div>
    );    
};

export default MapMapbox;
