function calculateDistance(coord1, coord2) {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    const radius = 6371;
    const lat1Rad = (Math.PI * lat1) / 180;
    const lat2Rad = (Math.PI * lat2) / 180;
    const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = radius * c;
    return distance;
}

function findNearestNeighbor(depot, unvisitedCustomers) {
    let nearestCustomer = null;
    let nearestDistance = Infinity;

    for (const customer of unvisitedCustomers) {
        const distance = calculateDistance(depot, customer);

        if (distance < nearestDistance) {
            nearestCustomer = customer;
            nearestDistance = distance;
        }
    }

    return nearestCustomer;
}

export function nearestNeighborAlgorithm(depot, customers, maxCapacity) {
    const routes = [];
    const unvisitedCustomers = [...customers];
    let currentLocation = depot;
    let currentRoute = [depot];
    let currentCapacity = 0;

    while (unvisitedCustomers.length > 0) {
        const nearestCustomer = findNearestNeighbor(currentLocation, unvisitedCustomers);

        if (nearestCustomer) {
            if (currentCapacity + 1 <= maxCapacity) {
                currentRoute.push(nearestCustomer);
                unvisitedCustomers.splice(unvisitedCustomers.indexOf(nearestCustomer), 1);
                currentLocation = nearestCustomer;
                currentCapacity += 1;
            } else {
                currentRoute.push(depot);
                routes.push(currentRoute);
                currentRoute = [depot];
                currentLocation = depot;
                currentCapacity = 0;
            }
        } else {
            console.log("No nearest customer found. Exiting loop.");
            break;
        }
    }

    if (currentRoute.length > 1) {
        routes.push(currentRoute);
    }
    console.log("ROUTES", routes);
    return routes;
}