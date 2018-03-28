/**
 * Contains everything to do with statistical analysis of points within a world.
 *
 * Most functions are simple wrappers that will call stats-lite library functions without having to directly use
 * the library.
 */

function mean(dataVector){
    return jStat.mean(dataVector);
}

function sum(dataVector){
    return jStat.sum(dataVector);
}

function median(dataVector){
    return jStat.median(dataVector);
}

function mode(dataVector){
    return jStat.mode(dataVector);
}

function variance(dataVector){
    return jStat.variance(dataVector);
}

function stdev(dataVector){
    return jStat.stdev(dataVector);
}

function histogram(dataVector){
    return jStat.histogram(dataVector);
}



