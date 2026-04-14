import TripCard from './TripCard'
import BoletaCard from './BoletaCard'

export default function TripList({ trips, onUpdate, dieselPrice, unitYields, defaultYield }) {
    const handleTripUpdate = (updatedTrip) => {
        const newTrips = trips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
        onUpdate(newTrips)
    }

    return (
        <div className="space-y-6">
            {trips.map((trip, idx) => {
                const CardComponent = trip.source_type === 'GENESIS_BOLETA' ? BoletaCard : TripCard
                return (
                    <CardComponent
                        key={trip.id || idx}
                        trip={trip}
                        onUpdate={handleTripUpdate}
                        dieselPrice={dieselPrice}
                        unitYields={unitYields}
                        defaultYield={defaultYield}
                    />
                )
            })}
        </div>
    )
}

