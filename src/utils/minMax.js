const minMax = (arr) => {
    if (!arr) return null;

    let minV = arr[0];
    let maxV = arr[0];
    for (let a of arr) {
        if (a < minV) 
            minV = a;
        else if (a > maxV) 
            maxV = a;
    }
    return [minV, maxV];
}

module.exports = minMax;
