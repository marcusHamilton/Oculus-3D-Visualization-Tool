/**
 * Contains everything to do with statistical analysis of points within a world.
 *
 * Most functions are simple helpers that will call stats-lite library functions without having to directly use
 * the library.
 */


function mean(dataVector){
    return stats.mean(dataVector);
}

function sum(dataVector){
    return stats.sum(dataVector);
}

function median(dataVector){
    return stats.median(dataVector);
}

function mode(dataVector){
    return stats.mode(dataVector);
}

function variance(dataVector){
    return stats.variance(dataVector);
}

function stdev(dataVector){
    return stats.stdev(dataVector);
}

function histogram(dataVector){
    return stats.histogram(dataVector);
}



