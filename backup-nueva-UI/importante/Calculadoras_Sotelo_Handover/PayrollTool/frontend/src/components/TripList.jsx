import TripCard from './TripCard'

export default function TripList({ trips, onUpdate }) {
    // In a real app, optimize with useMemo/useCallback
    const handleTripUpdate = (updatedTrip) => {
        const newTrips = trips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
        onUpdate(newTrips)
    }

    return (
        <div className="space-y-6">
            {trips.map((trip, idx) => (
                <TripCard key={trip.id || idx} trip={trip} onUpdate={handleTripUpdate} />
            ))}
        </div>
    )
}
