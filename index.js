let brain = require('brain.js');
let fs = require('fs');


let net = new brain.NeuralNetwork();
let trainedNet;
const trainingData = [
    {
        input: "So true, thank you!",
        output: { trump: 1 }
    },{
        input: "Inside Chi's nursery",
        output: { kardashian: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { kardashian: 1 }
    },{
        input: "Feeling Blue (wearing @kkwbeauty powder contour in medium & dark contour kit as eye shadow, & a new lip coming soon)",
        output: { kardashian: 1 }
    },{
        input: "I love my mom so much as a blonde!! @KrisJenner @KUWTK",
        output: { kardashian: 1 }
    },{
        input: "I don’t really do wigs . It’s real.",
        output: { kardashian: 1 }
    },{
        input: "Wait the thought of going back dark makes me sad. @MyleezaKardash may have influenced me",
        output: { kardashian: 1 }
    },{
        input: "I went live on instagram! Thank you my BFF Allison for the fun interview and hank you to Creat & Cultivate for having me!",
        output: { kardashian: 1 }
    },{
        input: "On my way the the @createcultivate event! I’m being interviewed about business by my bff Allison. This should be fun!",
        output: { kardashian: 1 }
    },{
        input: "The sweetest! Best baby! She looks a tiny bit like North and a tiny bit like Saint but definitely her own person!",
        output: { kardashian: 1 }
    },{
        input: "Fashion Week is so much fun in the #KimKardashianGame! I'd love to see what you're wearing! http://smarturl.it/PlayKKH",
        output: { kardashian: 1 }
    },{
        input: "'Congressman Schiff omitted and distorted key facts' @FoxNews  So, what else is new. He is a total phony!",
        output: { trump: 1 }
    },{
        input: "I will be interviewed by @JudgeJeanine on @FoxNews at 9:00 P.M. Enjoy!",
        output: { trump: 1 }
    },{
        input: "Dem Memo: FBI did not disclose who the clients were - the Clinton Campaign and the DNC. Wow!",
        output: { trump: 1 }
    },{
        input: "The Democrat memo response on government surveillance abuses is a total political and legal BUST. Just confirms all of the terrible things that were done. SO ILLEGAL!",
        output: { trump: 1 }
    },{
        input: "Unemployment claims are at the lowest level since 1973. Much of this has to do with the massive cutting of unnecessary and job killing Regulations!",
        output: { trump: 1 }
    },{
        input: "So true Wayne, and Lowest black unemployment in history!",
        output: { trump: 1 }
    },{
        input: "Thank you to the great men and women of the United States @SecretService for a job well done!",
        output: { trump: 1 }
    },{
        input: "Today, @FLOTUS Melania and I were honored to welcome Prime Minister @TurnbullMalcolm and Mrs. Turnbull of Australia to the @WhiteHouse!",
        output: { trump: 1 }
    },{
        input: "After years of rebuilding OTHER nations, we are finally rebuilding OUR nation - and we are restoring our confidence and our pride!",
        output: { trump: 1 }
    },{
        input: "So true, thank you!",
        output: { trump: 1 }
    }
];







function encode(arg) {
    return arg.split('').map(x => (x.charCodeAt(0) / 256));
}

function processTrainingData(data) {
    return data.map(d => {
        return {
            input: encode(d.input),
            output: d.output
        }
    })
}

function train(data) {
    net.train(processTrainingData(data),
        {
            iterations: 1000,
            log:true,
            learningRate: 0.5,
            timeout: 500
        });
    trainedNet = net;
    let json = net.toJSON();
    fs.writeFile(__dirname + '/weights.json', JSON.stringify(json), function(err) {
        if (err) {
            return console.log(err);
        }

        console.log('DONE - Saved results to file.');
    });
};

function execute(input) {
    console.log('trainedNet',trainedNet);

    let results = trainedNet.run(encode(input));
    console.log(results);
    let output;
    let certainty;
    if (results.trump > results.kardashian) {
        output = 'Donald Trump'
        certainty = Math.floor(results.trump * 100)
    } else {
        output = 'Kim Kardashian'
        certainty = Math.floor(results.kardashian * 100)
    }

    return "I'm " + certainty + "% sure that tweet was written by " + output;
}
fs.readFile(__dirname + '/weights.json', function (err, trainedWeight) {

    console.log(err);
    console.log(trainedWeight);
    if (trainedWeight ){
        trainedNet = net.fromJSON(JSON.parse(trainedWeight));

        console.log(execute("Damn Lakeisha!!!!! Tasha did you wrong. I really feel for Tommy 💔 @lala I love you!!!!"));
    }else{
        train(trainingData);
        console.log(execute("Damn Lakeisha!!!!! Tasha did you wrong. I really feel for Tommy 💔 @lala I love you!!!!"));
    }


});
