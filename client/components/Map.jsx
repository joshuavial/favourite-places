import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { fetchFourSquare, fetchFruits } from '../actions'

// import {formatRelative} from "date-fns"

// Map Constants
const libraries = ['places']
const mapContainerStyle = {
  width: '100vw',
  height: '100vh'
}

const options = {
  zoomControl: true
}

function Map(props) {
  const [clickedPlace, setClickedPlace] = useState('') // The place you just clicked
  const [currentPosition, setCurrentPosition] = useState({}) // Places around your location
  const [position, setPosition] = useState('Auckland') // Where the map search starts
  const [latLng, setLatLng] = useState({ lat: -36.848461, lng: 174.763336 })

  const getPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCoordinates);
    } else {
      alert('Sorry! Your browser does not support Geo location.')
    }
  }

  const getCoordinates = (position) => {
    console.log(position)
    setLatLng({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    })
  }

  useEffect(() => {
    console.log('Map.useEffect: dispatching actions')
    props.dispatch(fetchFourSquare(position))
    props.dispatch(fetchFruits())
  }, [])

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBh_FVhVkRrg3kXqR6FkWOO7K35RSzxVl4',
    libraries
  })

  if (loadError) return 'Error loading Maps'
  if (!isLoaded) return 'Loading Maps'

  return (
    <div>
      <h1>Favourite Places</h1>
      <button onClick={getPosition}>button</button>
      {console.log('testing')}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={latLng}
        options={options}
      >
        {props.places.map(markedPlace => (
          <div>
            <Marker
              key={markedPlace.id}
              position={{ lat: markedPlace.location.lat, lng: markedPlace.location.lng }}
            />
          </div>
        ))}
      </GoogleMap>
    </div>
  )
}

function mapStateToProps(globalState) {
  const places = globalState.places.map(el => el.venue)
  console.log('mapState: ', places)
  return {
    places
  }
}

export default connect(mapStateToProps)(Map)
