/* =========================================
   MATCH TOSS v8
   COMPLETE JAVASCRIPT
========================================= */


let heads = 0;
let tails = 0;

let flipNumber = 0;

let callPlayer = 1;

let chosenSide = "HEADS";

let matchType = "CRICKET";

let tossWinner = "";

let finalDecision = "";

let team1Logo = "";

let team2Logo = "";


/* =========================================
   ELEMENTS
========================================= */

const matchNameInput =
    document.getElementById("matchName");

const matchDateInput =
    document.getElementById("matchDate");

const venueInput =
    document.getElementById("venue");

const player1Input =
    document.getElementById("player1");

const player2Input =
    document.getElementById("player2");


const cricketButton =
    document.getElementById("cricketButton");

const footballButton =
    document.getElementById("footballButton");

const generalButton =
    document.getElementById("generalButton");


const callPlayer1 =
    document.getElementById("callPlayer1");

const callPlayer2 =
    document.getElementById("callPlayer2");


const headsButton =
    document.getElementById("headsButton");

const tailsButton =
    document.getElementById("tailsButton");


const coin =
    document.getElementById("coin");


const result =
    document.getElementById("result");

const winner =
    document.getElementById("winner");


const tossButton =
    document.getElementById("tossButton");

const resetButton =
    document.getElementById("resetButton");


const headsDisplay =
    document.getElementById("heads");

const tailsDisplay =
    document.getElementById("tails");

const totalDisplay =
    document.getElementById("total");


const headsPercent =
    document.getElementById("headsPercent");

const tailsPercent =
    document.getElementById("tailsPercent");


const historyBox =
    document.getElementById("history");

const clearHistoryButton =
    document.getElementById(
        "clearHistoryButton"
    );


const actionArea =
    document.getElementById("actionArea");

const actionTitle =
    document.getElementById("actionTitle");

const batButton =
    document.getElementById("batButton");

const bowlButton =
    document.getElementById("bowlButton");


const finalMatchName =
    document.getElementById(
        "finalMatchName"
    );

const finalMatchDetails =
    document.getElementById(
        "finalMatchDetails"
    );

const finalTeam1 =
    document.getElementById(
        "finalTeam1"
    );

const finalTeam2 =
    document.getElementById(
        "finalTeam2"
    );

const finalLogo1 =
    document.getElementById(
        "finalLogo1"
    );

const finalLogo2 =
    document.getElementById(
        "finalLogo2"
    );

const finalCoin =
    document.getElementById(
        "finalCoin"
    );

const finalWinner =
    document.getElementById(
        "finalWinner"
    );

const finalDecisionText =
    document.getElementById(
        "finalDecision"
    );


const logo1Input =
    document.getElementById("logo1");

const logo2Input =
    document.getElementById("logo2");

const logoPreview1 =
    document.getElementById(
        "logoPreview1"
    );

const logoPreview2 =
    document.getElementById(
        "logoPreview2"
    );


/* =========================================
   HISTORY
========================================= */

let savedMatches =
    JSON.parse(
        localStorage.getItem(
            "matchTossHistory"
        )
    ) || [];


/* =========================================
   DATE
========================================= */

const today =
    new Date()
        .toISOString()
        .split("T")[0];


matchDateInput.value =
    today;


/* =========================================
   LOGO 1
========================================= */

logo1Input.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        if (!file) {
            return;
        }

        const reader =
            new FileReader();

        reader.onload =
            function (event) {

                team1Logo =
                    event.target.result;

                logoPreview1.innerHTML =
                    `<img src="${team1Logo}">`;

                finalLogo1.src =
                    team1Logo;

            };

        reader.readAsDataURL(file);

    }
);


/* =========================================
   LOGO 2
========================================= */

logo2Input.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        if (!file) {
            return;
        }

        const reader =
            new FileReader();

        reader.onload =
            function (event) {

                team2Logo =
                    event.target.result;

                logoPreview2.innerHTML =
                    `<img src="${team2Logo}">`;

                finalLogo2.src =
                    team2Logo;

            };

        reader.readAsDataURL(file);

    }
);


/* =========================================
   MATCH TYPE
========================================= */

cricketButton.addEventListener(
    "click",
    function () {

        matchType =
            "CRICKET";

        cricketButton.classList.add(
            "active"
        );

        footballButton.classList.remove(
            "active"
        );

        generalButton.classList.remove(
            "active"
        );

        updateActionButtons();

    }
);


footballButton.addEventListener(
    "click",
    function () {

        matchType =
            "FOOTBALL";

        footballButton.classList.add(
            "active"
        );

        cricketButton.classList.remove(
            "active"
        );

        generalButton.classList.remove(
            "active"
        );

        updateActionButtons();

    }
);


generalButton.addEventListener(
    "click",
    function () {

        matchType =
            "GENERAL";

        generalButton.classList.add(
            "active"
        );

        cricketButton.classList.remove(
            "active"
        );

        footballButton.classList.remove(
            "active"
        );

        updateActionButtons();

    }
);


/* =========================================
   CALL TOSS
========================================= */

callPlayer1.addEventListener(
    "click",
    function () {

        callPlayer = 1;

        callPlayer1.classList.add(
            "active"
        );

        callPlayer2.classList.remove(
            "active"
        );

    }
);


callPlayer2.addEventListener(
    "click",
    function () {

        callPlayer = 2;

        callPlayer2.classList.add(
            "active"
        );

        callPlayer1.classList.remove(
            "active"
        );

    }
);


/* =========================================
   HEADS / TAILS
========================================= */

headsButton.addEventListener(
    "click",
    function () {

        chosenSide =
            "HEADS";

        headsButton.classList.add(
            "active"
        );

        tailsButton.classList.remove(
            "active"
        );

    }
);


tailsButton.addEventListener(
    "click",
    function () {

        chosenSide =
            "TAILS";

        tailsButton.classList.add(
            "active"
        );

        headsButton.classList.remove(
            "active"
        );

    }
);


/* =========================================
   ACTION BUTTONS
========================================= */

function updateActionButtons() {

    if (
        matchType === "CRICKET"
    ) {

        actionTitle.textContent =
            "TOSS WINNER DECISION";

        batButton.textContent =
            "🏏 BAT";

        bowlButton.textContent =
            "🎯 BOWL";

    }

    else if (
        matchType === "FOOTBALL"
    ) {

        actionTitle.textContent =
            "TOSS WINNER DECISION";

        batButton.textContent =
            "⚽ KICK OFF";

        bowlButton.textContent =
            "🔄 CHOOSE SIDE";

    }

    else {

        actionTitle.textContent =
            "MATCH DECISION";

        batButton.textContent =
            "OPTION 1";

        bowlButton.textContent =
            "OPTION 2";

    }

}


/* =========================================
   SOUND
========================================= */

function playCoinSound() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        const audio =
            new AudioContext();

        const oscillator =
            audio.createOscillator();

        const gain =
            audio.createGain();

        oscillator.connect(gain);

        gain.connect(
            audio.destination
        );

        oscillator.type =
            "sine";

        oscillator.frequency.setValueAtTime(
            650,
            audio.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            180,
            audio.currentTime + 0.4
        );

        gain.gain.setValueAtTime(
            0.1,
            audio.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audio.currentTime + 0.4
        );

        oscillator.start();

        oscillator.stop(
            audio.currentTime + 0.4
        );

    }

    catch (error) {

        console.log(
            "Sound unavailable"
        );

    }

}


/* =========================================
   TOSS
========================================= */

tossButton.addEventListener(
    "click",
    function () {

        let team1 =
            player1Input.value.trim();

        let team2 =
            player2Input.value.trim();

        let matchName =
            matchNameInput.value.trim();

        let date =
            matchDateInput.value;

        let venue =
            venueInput.value.trim();


        if (team1 === "") {

            team1 =
                "Team 1";

        }


        if (team2 === "") {

            team2 =
                "Team 2";

        }


        if (matchName === "") {

            matchName =
                team1 +
                " vs " +
                team2;

        }


        if (date === "") {

            date =
                today;

        }


        if (venue === "") {

            venue =
                "Venue not specified";

        }


        /* START */

        tossButton.disabled =
            true;


        const app =
            document.querySelector(
                ".app"
            );


        app.classList.add(
            "tossing"
        );


        coin.classList.add(
            "flipping"
        );


        result.textContent =
            "FLIPPING...";


        winner.textContent =
            "The coin is in the air...";


        finalWinner.textContent =
            "Determining winner...";


        finalDecisionText.textContent =
            "Waiting for decision...";


        finalMatchName.textContent =
            matchName;


        finalTeam1.textContent =
            team1;


        finalTeam2.textContent =
            team2;


        finalMatchDetails.textContent =
            "📅 " +
            date +
            " • 🏟️ " +
            venue;


        if (team1Logo) {

            finalLogo1.src =
                team1Logo;

        }


        if (team2Logo) {

            finalLogo2.src =
                team2Logo;

        }


        playCoinSound();


        /* RANDOM */

        const isHeads =
            Math.random() < 0.5;


        const coinResult =
            isHeads
                ? "HEADS"
                : "TAILS";


        /* ROTATION */

        flipNumber++;


        let rotation;


        if (isHeads) {

            rotation =
                flipNumber *
                720;

        }

        else {

            rotation =
                flipNumber *
                720 +
                180;

        }


        coin.style.transform =
            `rotateY(${rotation}deg)`;


        /* WAIT */

        setTimeout(
            function () {


                app.classList.remove(
                    "tossing"
                );


                coin.classList.remove(
                    "flipping"
                );


                /* STATS */

                if (
                    coinResult ===
                    "HEADS"
                ) {

                    heads++;

                }

                else {

                    tails++;

                }


                const total =
                    heads +
                    tails;


                headsDisplay.textContent =
                    heads;

                tailsDisplay.textContent =
                    tails;

                totalDisplay.textContent =
                    total;


                headsPercent.textContent =
                    Math.round(
                        heads /
                        total *
                        100
                    ) + "%";


                tailsPercent.textContent =
                    Math.round(
                        tails /
                        total *
                        100
                    ) + "%";


                /* RESULT */

                result.textContent =
                    coinResult;


                result.classList.remove(
                    "result-pop"
                );


                void result.offsetWidth;


                result.classList.add(
                    "result-pop"
                );


                /* CALLER */

                let caller;

                let otherPlayer;


                if (
                    callPlayer === 1
                ) {

                    caller =
                        team1;

                    otherPlayer =
                        team2;

                }

                else {

                    caller =
                        team2;

                    otherPlayer =
                        team1;

                }


                /* WINNER */

                if (
                    chosenSide ===
                    coinResult
                ) {

                    tossWinner =
                        caller;

                }

                else {

                    tossWinner =
                        otherPlayer;

                }


                winner.innerHTML =
                    "🏆 " +
                    escapeHTML(
                        tossWinner
                    ) +
                    " wins the toss!";


                /* FINAL */

                finalCoin.textContent =
                    "🪙 " +
                    coinResult;


                finalWinner.textContent =
                    "🏆 " +
                    tossWinner;


                finalDecisionText.textContent =
                    "Waiting for " +
                    tossWinner +
                    " to make a decision...";


                actionArea.style.display =
                    "block";


                /* SAVE */

                saveMatch(
                    matchName,
                    team1,
                    team2,
                    coinResult,
                    tossWinner,
                    "Decision pending",
                    date,
                    venue
                );


                tossButton.disabled =
                    false;


            },
            1200
        );

    }
);


/* =========================================
   DECISION 1
========================================= */

batButton.addEventListener(
    "click",
    function () {

        if (!tossWinner) {

            return;

        }


        if (
            matchType ===
            "CRICKET"
        ) {

            finalDecision =
                "BAT";

            finalDecisionText.innerHTML =
                "🏏 " +
                escapeHTML(
                    tossWinner
                ) +
                " chose <strong>BAT</strong>.";

        }

        else if (
            matchType ===
            "FOOTBALL"
        ) {

            finalDecision =
                "KICK OFF";

            finalDecisionText.innerHTML =
                "⚽ " +
                escapeHTML(
                    tossWinner
                ) +
                " chose <strong>KICK OFF</strong>.";

        }

        else {

            finalDecision =
                "OPTION 1";

            finalDecisionText.innerHTML =
                escapeHTML(
                    tossWinner
                ) +
                " chose <strong>OPTION 1</strong>.";

        }


        updateLatestMatch();

    }
);


/* =========================================
   DECISION 2
========================================= */

bowlButton.addEventListener(
    "click",
    function () {

        if (!tossWinner) {

            return;

        }


        if (
            matchType ===
            "CRICKET"
        ) {

            finalDecision =
                "BOWL";

            finalDecisionText.innerHTML =
                "🎯 " +
                escapeHTML(
                    tossWinner
                ) +
                " chose <strong>BOWL</strong>.";

        }

        else if (
            matchType ===
            "FOOTBALL"
        ) {

            finalDecision =
                "CHOOSE SIDE";

            finalDecisionText.innerHTML =
                "🔄 " +
                escapeHTML(
                    tossWinner
                ) +
                " chose <strong>CHOOSE SIDE</strong>.";

        }

        else {

            finalDecision =
                "OPTION 2";

            finalDecisionText.innerHTML =
                escapeHTML(
                    tossWinner
                ) +
                " chose <strong>OPTION 2</strong>.";

        }


        updateLatestMatch();

    }
);


/* =========================================
   SAVE
========================================= */

function saveMatch(
    matchName,
    team1,
    team2,
    coinResult,
    tossWinner,
    decision,
    date,
    venue
) {

    const match = {

        matchName:
            matchName,

        team1:
            team1,

        team2:
            team2,

        coinResult:
            coinResult,

        winner:
            tossWinner,

        decision:
            decision,

        date:
            date,

        venue:
            venue,

        savedAt:
            new Date().toLocaleString()

    };


    savedMatches.unshift(
        match
    );


    if (
        savedMatches.length >
        20
    ) {

        savedMatches =
            savedMatches.slice(
                0,
                20
            );

    }


    localStorage.setItem(
        "matchTossHistory",
        JSON.stringify(
            savedMatches
        )
    );


    displayHistory();

}


/* =========================================
   UPDATE HISTORY
========================================= */

function updateLatestMatch() {

    if (
        savedMatches.length === 0
    ) {

        return;

    }


    savedMatches[0].decision =
        finalDecision;


    localStorage.setItem(
        "matchTossHistory",
        JSON.stringify(
            savedMatches
        )
    );


    displayHistory();

}


/* =========================================
   HISTORY DISPLAY
========================================= */

function displayHistory() {

    if (
        savedMatches.length === 0
    ) {

        historyBox.innerHTML =
            "<p>No saved matches yet.</p>";

        return;

    }


    historyBox.innerHTML =
        "";


    savedMatches.forEach(
        function (match) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "history-item";


            item.innerHTML =

                `
                <strong>
                    ${escapeHTML(
                        match.matchName
                    )}
                </strong>

                <br>

                ${escapeHTML(
                    match.team1
                )}

                VS

                ${escapeHTML(
                    match.team2
                )}

                <br>

                🪙
                ${escapeHTML(
                    match.coinResult
                )}

                • 🏆
                ${escapeHTML(
                    match.winner
                )}

                <br>

                Decision:
                ${escapeHTML(
                    match.decision
                )}

                <br>

                📅
                ${escapeHTML(
                    match.date
                )}

                • 🏟️
                ${escapeHTML(
                    match.venue
                )}

                `;


            historyBox.appendChild(
                item
            );

        }
    );

}


/* =========================================
   CLEAR HISTORY
========================================= */

clearHistoryButton.addEventListener(
    "click",
    function () {

        if (
            savedMatches.length === 0
        ) {

            return;

        }


        if (
            !confirm(
                "Clear all toss history?"
            )
        ) {

            return;

        }


        savedMatches =
            [];


        localStorage.removeItem(
            "matchTossHistory"
        );


        displayHistory();

    }
);


/* =========================================
   RESET
========================================= */

resetButton.addEventListener(
    "click",
    function () {

        heads = 0;

        tails = 0;

        flipNumber = 0;

        tossWinner = "";

        finalDecision = "";


        coin.style.transform =
            "rotateY(0deg)";


        coin.classList.remove(
            "flipping"
        );


        document
            .querySelector(".app")
            .classList.remove(
                "tossing"
            );


        result.textContent =
            "READY?";


        winner.textContent =
            "Enter the teams and call the toss.";


        headsDisplay.textContent =
            "0";


        tailsDisplay.textContent =
            "0";


        totalDisplay.textContent =
            "0";


        headsPercent.textContent =
            "0%";


        tailsPercent.textContent =
            "0%";


        finalMatchName.textContent =
            matchNameInput.value ||
            "My Match";


        finalTeam1.textContent =
            player1Input.value ||
            "Team 1";


        finalTeam2.textContent =
            player2Input.value ||
            "Team 2";


        finalMatchDetails.textContent =
            "📅 " +
            (
                matchDateInput.value ||
                today
            ) +
            " • 🏟️ " +
            (
                venueInput.value ||
                "Venue not specified"
            );


        finalCoin.textContent =
            "TOSS RESULT";


        finalWinner.textContent =
            "Waiting for toss...";


        finalDecisionText.textContent =
            "Waiting for decision...";


        tossButton.disabled =
            false;

    }
);


/* =========================================
   SECURITY
========================================= */

function escapeHTML(text) {

    return String(text)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================
   START
========================================= */

actionArea.style.display =
    "block";

displayHistory();

updateActionButtons();