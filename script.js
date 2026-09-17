/* =========================================================
   CRICKET MATCH PRO
   COMPLETE GAME ENGINE
========================================================= */

let match = null;

let historyStack = [];


/* =========================================================
   HELPERS
========================================================= */

function $(id) {
    return document.getElementById(id);
}


function showScreen(id) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    $(id).classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function cleanPlayers(text, count) {

    let players = text
        .split("\n")
        .map(x => x.trim())
        .filter(x => x.length > 0);

    while (players.length < count) {
        players.push(`Player ${players.length + 1}`);
    }

    return players.slice(0, count);
}


/* =========================================================
   PLAYER DATA
========================================================= */

function createPlayers(names) {

    return names.map((name, index) => {

        return {
            id: index,
            name: name,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            out: false,
            status: "Yet to bat"
        };

    });
}


function createBowlers(names) {

    return names.map((name, index) => {

        return {
            id: index,
            name: name,
            balls: 0,
            runs: 0,
            wickets: 0
        };

    });
}


/* =========================================================
   START MATCH
========================================================= */

function startToss() {

    const team1 =
        $("team1Input").value.trim() || "Team A";

    const team2 =
        $("team2Input").value.trim() || "Team B";

    const overs =
        parseInt($("oversInput").value);

    const playersCount =
        parseInt($("playersInput").value);

    const players1 =
        cleanPlayers(
            $("players1Input").value,
            playersCount
        );

    const players2 =
        cleanPlayers(
            $("players2Input").value,
            playersCount
        );


    match = {

        team1: team1,

        team2: team2,

        oversLimit: overs,

        playersCount: playersCount,

        players1: createPlayers(players1),

        players2: createPlayers(players2),

        tossWinner: null,

        battingFirst: null,

        bowlingFirst: null,

        currentInnings: 1,

        innings1: null,

        innings2: null

    };


    $("tossTeam1").textContent = team1;
    $("tossTeam2").textContent = team2;

    $("winnerName").textContent = "";

    $("tossResult").classList.add("hidden");

    $("tossButton").classList.remove("hidden");

    showScreen("tossScreen");
}


/* =========================================================
   TOSS
========================================================= */

function performToss() {

    if (!match) return;

    const coin = $("coin");
    const button = $("tossButton");

    button.disabled = true;

    coin.classList.remove("flipping");

    void coin.offsetWidth;

    coin.classList.add("flipping");


    setTimeout(() => {

        const winner =
            Math.random() < 0.5
                ? match.team1
                : match.team2;

        match.tossWinner = winner;

        $("winnerName").textContent = winner;

        $("tossResult").classList.remove("hidden");

        button.classList.add("hidden");

    }, 1200);
}


/* =========================================================
   TOSS CHOICE
========================================================= */

function chooseToss(choice) {

    if (!match || !match.tossWinner) return;


    match.battingFirst =
        choice === "bat"
            ? match.tossWinner
            : getOtherTeam(match.tossWinner);


    match.bowlingFirst =
        getOtherTeam(match.battingFirst);


    match.currentInnings = 1;


    createInnings(
        match.battingFirst,
        match.bowlingFirst,
        1
    );


    showScreen("gameScreen");

    updateUI();
}


/* =========================================================
   TEAM HELPERS
========================================================= */

function getOtherTeam(team) {

    return team === match.team1
        ? match.team2
        : match.team1;
}


function getTeamPlayers(team) {

    return team === match.team1
        ? match.players1
        : match.players2;
}


/* =========================================================
   CREATE INNINGS
========================================================= */

function createInnings(
    battingTeam,
    bowlingTeam,
    number
) {

    const battingPlayers =
        getTeamPlayers(battingTeam);

    const bowlingPlayers =
        getTeamPlayers(bowlingTeam);


    const innings = {

        number: number,

        battingTeam: battingTeam,

        bowlingTeam: bowlingTeam,

        score: 0,

        wickets: 0,

        legalBalls: 0,

        totalBalls: 0,

        extras: {
            wides: 0,
            noBalls: 0,
            byes: 0,
            legByes: 0
        },

        batsmen: createPlayers(
            battingPlayers.map(p => p.name)
        ),

        bowlers: createBowlers(
            bowlingPlayers.map(p => p.name)
        ),

        striker: 0,

        nonStriker: 1,

        nextBatter: 2,

        currentBowler: 0,

        balls: []

    };


    innings.batsmen[0].status = "Not out";
    innings.batsmen[1].status = "Not out";


    if (number === 1) {

        match.innings1 = innings;

    } else {

        match.innings2 = innings;

    }

    historyStack = [];
}


/* =========================================================
   CURRENT INNINGS
========================================================= */

function getCurrentInnings() {

    return match.currentInnings === 1
        ? match.innings1
        : match.innings2;
}


/* =========================================================
   SAVE STATE FOR UNDO
========================================================= */

function saveState() {

    historyStack.push(
        JSON.stringify(match)
    );

    if (historyStack.length > 30) {
        historyStack.shift();
    }
}


/* =========================================================
   CURRENT BOWLER
========================================================= */

function getCurrentBowler() {

    const innings = getCurrentInnings();

    return innings.bowlers[
        innings.currentBowler
    ];
}


function selectBowler() {

    const innings = getCurrentInnings();

    const select = $("bowlerSelect");

    if (!select) return;

    select.innerHTML = "";

    innings.bowlers.forEach((bowler, index) => {

        const option =
            document.createElement("option");

        option.value = index;

        option.textContent = bowler.name;

        if (index === innings.currentBowler) {
            option.selected = true;
        }

        select.appendChild(option);

    });


    select.onchange = function () {

        innings.currentBowler =
            parseInt(this.value);

        updateUI();
    };
}


/* =========================================================
   ADD RUNS
========================================================= */

function addRuns(runs) {

    if (!match) return;

    const innings = getCurrentInnings();

    if (isInningsFinished(innings)) return;


    saveState();


    const striker =
        innings.batsmen[innings.striker];

    const bowler =
        getCurrentBowler();


    striker.runs += runs;
    striker.balls += 1;

    if (runs === 4) {
        striker.fours++;
    }

    if (runs === 6) {
        striker.sixes++;
    }


    innings.score += runs;

    innings.legalBalls++;

    innings.totalBalls++;


    bowler.balls++;
    bowler.runs += runs;


    innings.balls.push({

        type: "run",

        runs: runs,

        striker: striker.name,

        overBall: getBallLabel(innings),

        bowler: bowler.name

    });


    if (runs % 2 === 1) {
        swapStrike(innings);
    }


    checkEndOfBall();

    updateUI();

    autoSave();
}


/* =========================================================
   EXTRAS
========================================================= */

function addExtra(type) {

    if (!match) return;

    const innings = getCurrentInnings();

    if (isInningsFinished(innings)) return;


    saveState();


    const striker =
        innings.batsmen[innings.striker];

    const bowler =
        getCurrentBowler();


    let label = "";

    switch (type) {

        case "wide":

            innings.score += 1;
            innings.extras.wides += 1;

            bowler.runs += 1;

            innings.balls.push({
                type: "wide",
                runs: 1,
                striker: striker.name,
                overBall: getBallLabel(innings),
                bowler: bowler.name
            });

            label = "Wide";

            break;


        case "noball":

            innings.score += 1;
            innings.extras.noBalls += 1;

            bowler.runs += 1;

            innings.totalBalls++;

            innings.balls.push({
                type: "noball",
                runs: 1,
                striker: striker.name,
                overBall: getBallLabel(innings),
                bowler: bowler.name
            });

            label = "No Ball";

            break;


        case "bye":

            innings.score += 1;
            innings.extras.byes += 1;

            innings.legalBalls++;
            innings.totalBalls++;

            bowler.balls++;

            innings.balls.push({
                type: "bye",
                runs: 1,
                striker: striker.name,
                overBall: getBallLabel(innings),
                bowler: bowler.name
            });

            label = "Bye";

            break;


        case "legbye":

            innings.score += 1;
            innings.extras.legByes += 1;

            innings.legalBalls++;
            innings.totalBalls++;

            bowler.balls++;

            innings.balls.push({
                type: "legbye",
                runs: 1,
                striker: striker.name,
                overBall: getBallLabel(innings),
                bowler: bowler.name
            });

            label = "Leg Bye";

            break;
    }


    if (
        type === "bye" ||
        type === "legbye"
    ) {

        swapStrike(innings);
    }


    checkEndOfBall();

    updateUI();

    autoSave();
}


/* =========================================================
   WICKET
========================================================= */

function addWicket() {

    if (!match) return;

    const innings = getCurrentInnings();

    if (isInningsFinished(innings)) return;


    saveState();


    const batter =
        innings.batsmen[innings.striker];

    const bowler =
        getCurrentBowler();


    batter.out = true;

    batter.status = "Out";

    batter.balls += 1;


    innings.wickets++;

    innings.legalBalls++;

    innings.totalBalls++;


    bowler.balls++;

    bowler.wickets++;


    innings.balls.push({

        type: "wicket",

        runs: 0,

        striker: batter.name,

        overBall: getBallLabel(innings),

        bowler: bowler.name

    });


    if (
        innings.wickets <
        match.playersCount - 1
    ) {

        const newBatter =
            innings.nextBatter;

        if (
            newBatter <
            innings.batsmen.length
        ) {

            innings.striker = newBatter;

            innings.nextBatter++;

            innings.batsmen[newBatter].status =
                "Not out";

        }

    }


    checkEndOfBall();

    updateUI();

    autoSave();
}


/* =========================================================
   STRIKE
========================================================= */

function swapStrike(innings) {

    const temp = innings.striker;

    innings.striker =
        innings.nonStriker;

    innings.nonStriker =
        temp;
}


/* =========================================================
   BALL LABEL
========================================================= */

function getBallLabel(innings) {

    const over =
        Math.floor(
            innings.legalBalls / 6
        );

    const ball =
        (innings.legalBalls % 6) + 1;

    return `${over}.${ball}`;
}


/* =========================================================
   CHECK END OF BALL
========================================================= */

function checkEndOfBall() {

    const innings = getCurrentInnings();


    if (
        innings.legalBalls > 0 &&
        innings.legalBalls % 6 === 0
    ) {

        swapStrike(innings);

        if (
            innings.legalBalls / 6 <
            match.oversLimit
        ) {

            chooseNextBowler();

        }
    }


    if (isInningsFinished(innings)) {

        setTimeout(() => {

            if (
                match.currentInnings === 1
            ) {

                startSecondInnings();

            } else {

                finishMatch();

            }

        }, 500);
    }
}


/* =========================================================
   NEXT BOWLER
========================================================= */

function chooseNextBowler() {

    const innings = getCurrentInnings();

    if (innings.bowlers.length <= 1) {
        return;
    }


    let next =
        (innings.currentBowler + 1)
        % innings.bowlers.length;


    innings.currentBowler = next;
}


/* =========================================================
   END OVER BUTTON
========================================================= */

function endOver() {

    const innings = getCurrentInnings();

    if (!innings) return;


    if (
        innings.legalBalls === 0 ||
        innings.legalBalls % 6 !== 0
    ) {

        alert(
            "An over can only end after 6 legal balls."
        );

        return;
    }


    chooseNextBowler();

    updateUI();
}


/* =========================================================
   INNINGS FINISHED
========================================================= */

function isInningsFinished(innings) {

    if (!innings) return true;


    if (
        innings.legalBalls >=
        match.oversLimit * 6
    ) {

        return true;
    }


    if (
        innings.wickets >=
        match.playersCount - 1
    ) {

        return true;
    }


    if (
        match.currentInnings === 2 &&
        match.innings1 &&
        innings.score >
        match.innings1.score
    ) {

        return true;
    }


    return false;
}


/* =========================================================
   SECOND INNINGS
========================================================= */

function startSecondInnings() {

    if (match.currentInnings === 2) return;


    match.currentInnings = 2;


    const battingTeam =
        getOtherTeam(match.battingFirst);

    const bowlingTeam =
        match.battingFirst;


    createInnings(
        battingTeam,
        bowlingTeam,
        2
    );


    alert(
        `Second innings started!\nTarget: ${match.innings1.score + 1}`
    );


    showScreen("gameScreen");

    updateUI();

    autoSave();
}


/* =========================================================
   FINISH MATCH
========================================================= */

function finishMatch() {

    const first =
        match.innings1;

    const second =
        match.innings2;


    if (!first || !second) return;


    let result = "";

    let details = "";


    if (second.score > first.score) {

        const wicketsLeft =
            match.playersCount -
            1 -
            second.wickets;

        result =
            `${second.battingTeam} won!`;

        details =
            `Won by ${wicketsLeft} wicket${
                wicketsLeft !== 1 ? "s" : ""
            }.`;

    }

    else if (second.score < first.score) {

        const runs =
            first.score -
            second.score;

        result =
            `${first.battingTeam} won!`;

        details =
            `Won by ${runs} run${
                runs !== 1 ? "s" : ""
            }.`;

    }

    else {

        result = "Match Tied!";

        details =
            "Both teams finished on the same score.";
    }


    $("finalResult").textContent = result;

    $("resultDetails").textContent =
        details;


    $("finalTeam1").textContent =
        match.team1;

    $("finalTeam2").textContent =
        match.team2;


    const score1 =
        match.team1 === first.battingTeam
            ? first
            : second;


    const score2 =
        match.team2 === first.battingTeam
            ? first
            : second;


    $("finalScore1").textContent =
        `${score1.score}/${score1.wickets}`;


    $("finalScore2").textContent =
        `${score2.score}/${score2.wickets}`;


    showScreen("resultScreen");


    localStorage.setItem(
        "cricketMatch",
        JSON.stringify(match)
    );
}


/* =========================================================
   UPDATE UI
========================================================= */

function updateUI() {

    if (!match) return;


    const innings =
        getCurrentInnings();


    if (!innings) return;


    $("inningsLabel").textContent =
        innings.number === 1
            ? "1ST INNINGS"
            : "2ND INNINGS";


    $("battingTeamName").textContent =
        innings.battingTeam;


    $("scoreDisplay").textContent =
        `${innings.score}/${innings.wickets}`;


    $("oversDisplay").textContent =
        `(${formatOvers(innings.legalBalls)} / ${match.oversLimit})`;


    if (innings.number === 2) {

        $("targetBox").style.display =
            "block";

        $("targetDisplay").textContent =
            match.innings1.score + 1;

    } else {

        $("targetBox").style.display =
            "none";
    }


    const striker =
        innings.batsmen[innings.striker];

    const nonStriker =
        innings.batsmen[innings.nonStriker];


    $("strikerName").textContent =
        striker
            ? striker.name
            : "—";


    $("nonStrikerName").textContent =
        nonStriker
            ? nonStriker.name
            : "—";


    $("strikerRuns").textContent =
        striker
            ? striker.runs
            : 0;


    $("nonStrikerRuns").textContent =
        nonStriker
            ? nonStriker.runs
            : 0;


    $("wicketDisplay").textContent =
        innings.wickets;


    const overs =
        innings.legalBalls / 6;


    const runRate =
        overs > 0
            ? innings.score / overs
            : 0;


    $("runRateDisplay").textContent =
        runRate.toFixed(2);


    if (innings.number === 2) {

        const remainingOvers =
            match.oversLimit - overs;


        const remainingRuns =
            Math.max(
                0,
                match.innings1.score +
                1 -
                innings.score
            );


        const requiredRate =
            remainingOvers > 0
                ? remainingRuns / remainingOvers
                : 0;


        $("requiredRateDisplay").textContent =
            requiredRate.toFixed(2);

    } else {

        $("requiredRateDisplay").textContent =
            "—";
    }


    const progress =
        (
            innings.legalBalls /
            (match.oversLimit * 6)
        ) * 100;


    $("progressFill").style.width =
        Math.min(100, progress) + "%";


    $("overProgressText").textContent =
        `${innings.legalBalls % 6} / 6`;


    selectBowler();

    updateBattingTable();

    updateBowlingTable();

    updateBallHistory();
}


/* =========================================================
   FORMAT OVERS
========================================================= */

function formatOvers(balls) {

    const overs =
        Math.floor(balls / 6);

    const remaining =
        balls % 6;

    return `${overs}.${remaining}`;
}


/* =========================================================
   BATTING TABLE
========================================================= */

function updateBattingTable() {

    const innings =
        getCurrentInnings();

    const tbody =
        $("battingTable");

    tbody.innerHTML = "";


    innings.batsmen.forEach(
        (player, index) => {

            const row =
                document.createElement("tr");


            if (
                index === innings.striker ||
                index === innings.nonStriker
            ) {

                row.classList.add(
                    "active-row"
                );
            }


            let status =
                player.status;


            if (
                index === innings.striker ||
                index === innings.nonStriker
            ) {

                status = "Not out";
            }


            if (
                player.runs === 0 &&
                player.balls === 0 &&
                status === "Yet to bat"
            ) {

                status = "Yet to bat";
            }


            const strikeRate =
                player.balls > 0
                    ? (
                        player.runs /
                        player.balls *
                        100
                    ).toFixed(2)
                    : "0.00";


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(player.name)}
                    </strong>
                </td>

                <td>${player.runs}</td>

                <td>${player.balls}</td>

                <td>${player.fours}</td>

                <td>${player.sixes}</td>

                <td>${strikeRate}</td>

                <td class="${
                    status === "Out"
                        ? "status-out"
                        : "status-notout"
                }">
                    ${status}
                </td>

            `;


            tbody.appendChild(row);

        }
    );
}


/* =========================================================
   BOWLING TABLE
========================================================= */

function updateBowlingTable() {

    const innings =
        getCurrentInnings();

    const tbody =
        $("bowlingTable");

    tbody.innerHTML = "";


    innings.bowlers.forEach(
        bowler => {

            const overs =
                formatOvers(
                    bowler.balls
                );


            const decimalOvers =
                bowler.balls / 6;


            const economy =
                decimalOvers > 0
                    ? bowler.runs /
                      decimalOvers
                    : 0;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(bowler.name)}
                    </strong>
                </td>

                <td>${overs}</td>

                <td>${bowler.runs}</td>

                <td>${bowler.wickets}</td>

                <td>${economy.toFixed(2)}</td>

            `;


            tbody.appendChild(row);

        }
    );
}


/* =========================================================
   BALL HISTORY
========================================================= */

function updateBallHistory() {

    const innings =
        getCurrentInnings();

    const container =
        $("ballHistory");


    if (!innings.balls.length) {

        container.textContent =
            "No balls yet.";

        return;
    }


    container.innerHTML = "";


    innings.balls
        .slice()
        .reverse()
        .forEach(ball => {

            const div =
                document.createElement("div");


            div.classList.add("ball");


            if (ball.runs === 4) {
                div.classList.add(
                    "ball-four"
                );
            }

            if (ball.runs === 6) {
                div.classList.add(
                    "ball-six"
                );
            }

            if (ball.type === "wicket") {
                div.classList.add(
                    "ball-wicket"
                );
            }

            if (
                ball.type === "wide" ||
                ball.type === "noball" ||
                ball.type === "bye" ||
                ball.type === "legbye"
            ) {

                div.classList.add(
                    "ball-extra"
                );
            }


            let text = "";


            if (ball.type === "wicket") {

                text = "W";

            }

            else if (ball.type === "wide") {

                text = "Wd";

            }

            else if (ball.type === "noball") {

                text = "Nb";

            }

            else if (ball.type === "bye") {

                text = "B";

            }

            else if (ball.type === "legbye") {

                text = "Lb";

            }

            else {

                text = ball.runs;
            }


            div.textContent =
                `${ball.overBall} ${text}`;


            div.title =
                `${ball.striker} vs ${ball.bowler}`;


            container.appendChild(div);

        });
}


/* =========================================================
   UNDO
========================================================= */

function undoLast() {

    if (!historyStack.length) {

        alert("Nothing to undo.");

        return;
    }


    const previous =
        historyStack.pop();


    match =
        JSON.parse(previous);


    updateUI();

    autoSave();
}


/* =========================================================
   CLEAR BALL HISTORY
========================================================= */

function clearHistory() {

    if (!match) return;

    const innings =
        getCurrentInnings();

    innings.balls = [];

    updateBallHistory();
}


/* =========================================================
   AUTO SAVE
========================================================= */

function autoSave() {

    if (!match) return;

    localStorage.setItem(
        "cricketMatch",
        JSON.stringify(match)
    );
}


function saveMatch() {

    autoSave();

    alert(
        "Match saved successfully in this browser."
    );
}


/* =========================================================
   LOAD SAVED MATCH
========================================================= */

function loadSavedMatch() {

    const saved =
        localStorage.getItem(
            "cricketMatch"
        );


    if (!saved) return;


    try {

        match =
            JSON.parse(saved);

        if (
            match &&
            match.currentInnings
        ) {

            showScreen("gameScreen");

            updateUI();
        }

    } catch (error) {

        console.log(
            "Could not load saved match."
        );
    }
}


/* =========================================================
   NEW MATCH
========================================================= */

function newMatch() {

    localStorage.removeItem(
        "cricketMatch"
    );

    match = null;

    historyStack = [];

    showScreen("setupScreen");
}


/* =========================================================
   BACK TO GAME
========================================================= */

function backToGame() {

    if (!match) {

        showScreen("setupScreen");

        return;
    }


    showScreen("gameScreen");

    updateUI();
}


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   PLAYER COUNT UI
========================================================= */

function updatePlayerTitles() {

    const team1 =
        $("team1Input").value.trim()
        || "Team A";

    const team2 =
        $("team2Input").value.trim()
        || "Team B";


    $("playersTitle1").textContent =
        `${team1} Players`;

    $("playersTitle2").textContent =
        `${team2} Players`;
}


$("team1Input")
    .addEventListener(
        "input",
        updatePlayerTitles
    );


$("team2Input")
    .addEventListener(
        "input",
        updatePlayerTitles
    );


/* =========================================================
   INITIALIZATION
========================================================= */

updatePlayerTitles();

loadSavedMatch();
