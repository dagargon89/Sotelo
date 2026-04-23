import React, { useState } from 'react'
import TripCard from './TripCard'
import BoletaCard from './BoletaCard'
import TripListHeader from './TripListHeader'

export default function TripList({ trips, onUpdate, dieselPrice, unitYields, defaultYield }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const handleTripUpdate = (updatedTrip) => {
        const newTrips = trips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
        onUpdate(newTrips)
    }

    // Filter Logic
    const filteredTrips = trips.filter(trip => {
        const matchSearch = trip.Driver?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            trip.Trip_ID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            trip.Unit?.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchStatus = true;
        if (statusFilter === 'APPROVED') matchStatus = trip.Status === 'APPROVED';
        if (statusFilter === 'PENDING') matchStatus = trip.Status === 'PENDING' || trip.Status === 'NEEDS_INPUT';

        return matchSearch && matchStatus;
    });

    const approvedCount = trips.filter(t => t.Status === 'APPROVED').length;

    return (
        <div className="space-y-6">
            <TripListHeader 
                totalTrips={trips.length}
                approvedCount={approvedCount}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onFilterChange={setStatusFilter}
            />
            
            {filteredTrips.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <i className="fas fa-inbox text-4xl mb-3 opacity-20"></i>
                    <p className="font-medium text-sm">No se encontraron boletas con estos filtros.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredTrips.map((trip, idx) => {
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
            )}
        </div>
    )
}
