class assigner {
    #coordinates = null;
    #distanceMatrix = null;
    #savings = null;
    constructor(hq, parcel) {
        this.#coordinates = [hq, ...parcel];
    }
    calculateDistance(coord1, coord2) {
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
    distanceMatrix() {
        let main = [];
        for (let i = 0; i < this.#coordinates.length; i++) {
            let temp = [];
            for (let j = i + 1; j < this.#coordinates.length; j++) {
                console.log(`[${i},${j}] - ${this.calculateDistance(this.#coordinates[i], this.#coordinates[j])}`);
                temp.push(this.calculateDistance(this.#coordinates[i], this.#coordinates[j]));
            }
            main.push(temp);
        }
        this.#distanceMatrix = main;
        console.log(main);
    }
    clarkeFormula(i, j, k) {
        return (i + j) - k;
    }
    savings() {
        console.log(this.#distanceMatrix);
        let saving = [];
        for (let i = 0; i < this.#distanceMatrix[0].length; i++) {
            let tempcounter = 0;
            for (let j = i + 1; j < this.#distanceMatrix[0].length; j++) {
                //console.log(`${this.#distanceMatrix[0][i]} + ${this.#distanceMatrix[0][j]} - ${this.#distanceMatrix[i + 1][tempcounter]}`);
                let savings = this.clarkeFormula(this.#distanceMatrix[0][i], this.#distanceMatrix[0][j], this.#distanceMatrix[i + 1][tempcounter]);
                console.log(`0${i} + 0${j} - ${i + 1}, ${tempcounter} = ${savings}`);
                saving.push([i + 1, j + 1, savings]);
                tempcounter = tempcounter + 1;
            }
        }
        console.log(saving);
        this.#savings = saving;
    }

    sort() {
        this.#savings.sort((a, b) => b[2] - a[2]);
        console.log(this.#savings);
    }
    groupings(capacity) {
        let rider = [];
        let routeUsed = [];
        this.#savings.forEach(element => {
            console.log("Element", element);
            if (rider.length > 0) {
                if (routeUsed.length <= this.#coordinates.length) {
                    if (rider[rider.length - 1].length == Number(capacity)) {
                        console.log("FUll capacity")
                        let willInsert = [];

                        for (let j = 0; j < 2; j++) {
                            if (element[0] != rider[rider.length - 1][0] && element[0] != rider[rider.length - 1][1] && element[1] != rider[rider.length - 1][0] && element[1] != rider[rider.length - 1][1]) {
                                let insert = true;
                                for (let i = 0; i < routeUsed.length; i++) {
                                    console.log("Checking", element[j], routeUsed[i])
                                    if (element[j] == routeUsed[i]) {
                                        insert = false;
                                        break;
                                    }
                                }
                                if (insert) {
                                    willInsert.push(element[j]);
                                    routeUsed.push(element[j]);
                                }
                            }

                        }
                        if (willInsert.length > 0) {
                            willInsert.forEach(item => {
                                if (rider[rider.length - 1].length >= capacity) {
                                    rider.push([item]);
                                } else {
                                    rider[rider.length - 1].push(item);
                                    routeUsed.push(item);
                                }
                            })
                        }

                    } else {
                        console.log("else");
                        for (let i = 0; i < 2; i++) {
                            let notInsert = false;
                            for (let j = 0; j < rider[rider.length - 1].length; j++) {
                                console.log("Checking")
                                if (element[i] == rider[rider.length - 1][j]) {
                                    notInsert = true;
                                }
                            }
                            if (!notInsert) {
                                let insert = true;
                                for (let m = 0; m < routeUsed.length; m++) {
                                    if (element[i] == routeUsed[m]) {
                                        console.log("I found on the route");
                                        insert = false;
                                    }
                                }
                                if (insert) {
                                    if (rider[rider.length - 1].length >= capacity) {
                                        rider.push([element[i]]);
                                    } else {
                                        rider[rider.length - 1].push(element[i]);
                                        routeUsed.push(element[i]);
                                    }
                                } else {
                                    console.log("Invalidate this route");
                                    return;
                                }

                            }
                        }
                    }
                }
            } else {
                rider.push([element[0], element[1]]);
                routeUsed.push(element[0]);
                routeUsed.push(element[1]);
            }

        });

        console.log(rider);

        return rider;
    }


    mergeRoutes(capacity) {
        let rider = [];
        let usedRoutes = [];
        let last_slot = false;
        let coor = this.#coordinates;
        function checkMerge(current, item) {
            console.log("checkling for merge")
            let merge = false;
            let indexMerge = null;
            let similarCount = 0;
            let unique = null;
            for (let i = 0; i < current.length; i++) {
                for (let j = 0; j < current[i].length; j++) {
                    for (let k = 0; k < 2; k++) {
                        if (current[i][j] === item[k]) {
                            merge = true;
                            indexMerge = i;
                            console.log("Found similar", current[indexMerge]);
                            similarCount = similarCount + 1;
                            unique = k;
                            break;
                        }
                    }
                }
            }
            if (merge) {
                console.log("Current lenth", current[indexMerge].length, capacity);
                if (current[indexMerge].length >= capacity) {
                    console.log("already full, need to invalidate");
                    if (last_slot) {
                        console.log("last slot");
                        if ((coor.length - 1) % capacity == 0) {
                            console.log("Even, invalidate last slot");
                        } else {
                            console.log("odd, need to insert if unique");
                            if (similarCount == 1) {
                                current.push([item[unique == 0 ? 1 : 0]]);
                            }
                        }
                    }
                } else {
                    if (similarCount <= 1) {
                        console.log("Compatible to merge");
                        for (let i = 0; i < 2; i++) {
                            let insert = true;
                            for (let j = 0; j < 2; j++) {
                                if (current[indexMerge][j] === item[i]) {
                                    insert = false;
                                    break;
                                }
                            }
                            if (insert) {
                                current[indexMerge].push(item[i]);
                                usedRoutes.push(item[i]);

                            }
                        }
                    } else {
                        console.log("incopatible to merge, found on previous, need to invalidate");
                    }
                }
            } else {
                console.log("Cannot merge, need to insert to new");
                current.push([item[0], item[1]]);
                usedRoutes.push(item[0]);
                usedRoutes.push(item[1]);
            }

            console.log("Current", current);
            return current;
        }
        function isAlreadyUsed(currentUsed, item) {
            let isUsed = false;
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < currentUsed.length; j++) {
                    if (item[i] === currentUsed[j]) {
                        isUsed = true;
                        break;
                    }
                }
                if (!isUsed) {
                    console.log("Not used", item[i]);
                    rider.push([item[i]]);
                    usedRoutes.push(item[i]);
                }
            }
        }
        console.log(this.#coordinates.length);
        for (let i = 0; i < this.#savings.length; i++) {
            console.log(this.#savings[i], usedRoutes.length, this.#coordinates.length - 1);
            if (usedRoutes.length <= this.#coordinates.length - 1) {
                if (rider.length === 0) {
                    console.log("Inserting new")
                    rider.push([this.#savings[i][0], this.#savings[i][1]]);
                    usedRoutes.push(this.#savings[i][0]);
                    usedRoutes.push(this.#savings[i][1]);
                } else {
                    if (usedRoutes.length >= this.#coordinates.length - 2) {
                        console.log("last slot");
                        // 
                        last_slot = true;
                    }
                    rider = checkMerge(rider, this.#savings[i]);
                }
            } else {
                console.log("used all the pairs");
                break;
            }
        }
        console.log("Final", rider);
        return rider;
    }
    calculate(capacity) {
        this.distanceMatrix();
        this.savings();
        this.sort()
        //return this.groupings(capacity);
        return this.mergeRoutes(Number(capacity));
    }

}


export default assigner;