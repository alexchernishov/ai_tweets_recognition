let fs = require('fs');

let maxLengthInput = -1;
const fixLengths = (data) => {

    for (let i = 0; i < data.length; i++) {
        if (data[i].input.length > maxLengthInput) {
            maxLengthInput = data[i].input.length;
        }
    }
    for (let i = 0; i < data.length; i++) {
        while (data[i].input.length < maxLengthInput) {
            data[i].input.push(0);
        }
    }

    fs.writeFile(__dirname + '/maxLineLength.json', JSON.stringify({length:maxLengthInput}), function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('DONE - Saved maxLineLength.');
    });
    return data;
};
const fixLengthsInput = (data) => {

    while (data.length < 143) {
        data.push(0);
    }
    if(data.length > 143 )
    {
        data = data.slice(0, 143);
    }

    console.log(data.length);

    return data;

    fs.readFile(__dirname + '/maxLineLength.json', function (err, result) {

        result = JSON.parse(result);

        let maxLengthInput = (result && result.length) ? result.length : 0;

        while (data.length < maxLengthInput) {
            data.push(1);
        }
        if(data.length > maxLengthInput )
        {
            data = data.slice(0, maxLengthInput);
        }

        console.log(data.length);

        return data;
    });

};
const encode = d => {
    const newArr = [];
    d.split('').map(c => {
        newArr.push((c.charCodeAt(0) / 255))
    });
    return newArr
}

const encodeData = data => {

    return data.map( d => {

        return {
            input:  encode(d.input),
            output: d.output
        }
    })
}

const serialize = data => fixLengths(encodeData(data));

module.exports = {
    serialize:  serialize,
    encode:     encode,
    fixLengths: fixLengths,
    fixLengthsInput: fixLengthsInput
}