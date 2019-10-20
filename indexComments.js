let brain = require('brain.js');
let fs = require('fs');

let text = "день выдался удачным, я ожидала худшего, но у меня даже настроение отличное и это несмотря на то, что я ночью меньше 5 часов проспала:)";
let net = new brain.NeuralNetwork(/*{ activation: 'leaky-relu' }*/);
let trainedNet;
const serializer = require('./serializer');

let getMnistData = function(content, options) {
    let lines = content.toString().split('\n');

    let data = [];
    for (let i = 0; i < lines.length; i++) {
        let inputOutput = lines[i].split(';');
        let inputIndex = (options && options.data) ? options.data : 0;
        if(!inputOutput[inputIndex]){
            continue;
        }
        let input =inputOutput[inputIndex].replace(/["']/g, "");


        let outputIndex = (options && options.result) ? options.result : 1;
        if(!inputOutput[outputIndex]){
            continue;
        }
        let output =(parseInt(inputOutput[outputIndex].replace(/[^\d.-]/g, ''))===1) ? {good:1} : ((parseInt(inputOutput[outputIndex].replace(/[^\d.-]/g, ''))===0) ? {neutral:1} : {bad:1})  ;

        data.push({
            input: input,
            output: output
        });

    }

    return data;
};


function train(data) {
    let trainData = serializer.serialize(data);

    // console.log(trainData);
    net.train(trainData,
        {
            errorThresh: 0.005, // порог ошибок, которого нужно достичь
            iterations: 10, // максимальное число итераций обучения
            log: true, // нужен ли периодический console.log()
            logPeriod: 10, // число итераций между логированиями
            learningRate: 0.4, // степень обучения
            // timeout:500
        });
    trainedNet = net;
    // console.log(trainedNet);
    let json = net.toJSON();
    // fs.writeFile(__dirname + '/weights-pos-neg.json', JSON.stringify(json), function(err) {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log('DONE - Saved results to file.');
    // });
};

function execute(input) {


    let results = trainedNet.run(serializer.fixLengthsInput(serializer.encode(input)));
        let max = 0;
        let key = false;
        for (let i in Object.keys(results)){
            if(max<results[Object.keys(results)[i]]){
                max = results[Object.keys(results)[i]];
                key = Object.keys(results)[i];
            }
        }
    return results;
}
fs.readFile(__dirname + '/weights.json', function (err, trainedWeight) {

    if (trainedWeight ){
        trainedNet = net.fromJSON(JSON.parse(trainedWeight));

        console.log(execute(text));

    }else{
        fs.readFile(__dirname + '/positive.csv', 'utf-8', function (err1, trainContent) {

            let trainData1 = getMnistData(trainContent, {
                'data':3,
                'result':4
            });
            fs.readFile(__dirname + '/negative.csv', 'utf-8', function (err1, trainContent2) {

                let trainData2 = getMnistData(trainContent2,{
                    'data':3,
                    'result':4
                });
                let totalTrainData = trainData1.concat(trainData2);
                train(totalTrainData);
                console.log(execute(text));
            });

        });

    }


});

