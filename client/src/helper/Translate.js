import React from "react";
import {images} from "./Consts";
import './../styles/EditQuiz.css';

const ENG = "engelsk";
const NOR = "norsk";

export function FlagSelect(props) {
    if(props.showLangs){
        var langs = [];
        langs.push(
            <img
                key={0}
                className="f1 flag-btn-img"
                src={images[props.lang]}
                alt={props.lang}
                onClick={() => props.onClickLang(props.lang)}
            />
        );
        const langOpts = [ENG, NOR];
        for (const [i, l] of langOpts.entries()) {
            if(l === props.lang) continue;
            langs.push(
                <img
                    key={i+1}
                    className="f1 flag-btn-img"
                    src={images[l]}
                    alt={l}
                    onClick={() => props.onClickLang(l)}
                />
            )
        }
        return(
            <div className="col flag-box">
                {langs}
            </div>
        );
    }
    return(
        <div className="col flag-box">
            <img
                className="f1 flag-btn-img"
                src={images[props.lang]}
                alt={"exit"}
                onClick={() => props.onClickShowOpts()}
            />
        </div>
    );
}

export function T(text, language) {
    if(language === ENG) {
        return text;
    };
    if(language === NOR) {
        if(!Object.keys(Nor).includes(text)) {
            console.log("Translating [" + text + "] to Nor, not found in dict");
            return text;
        }
        return Nor[text];
    }
    console.log("Translating [" + text + "] to [" + language + "]: unknown language");
    return text;
}

const Nor = {
    "Join" : "Bli med",
    "Host" : "Arranger",
    "Invalid Quiz ID" : "Ugyldig Quiz Id",
    "Name already in use" : "Navnet er i bruk",
    "Enter a name" : "Skriv inn et navn",
    "Enter Quiz ID" : "Skriv inn Quiz ID",
    "Name:" : "Navn",
    "This page uses cookies to improve user experience." : "Siden lagrer et par informasjonskapsler for å bedre brukeropplevelsen.",
    "Oh No! The host got disconnected :(" : "Whoops! Arrangøren mista kontakt med serveren?",
    "Waiting for others to answer..." : "Venter på at andre svarer...",
    "Waiting for others to bet..." : "Venter på at andre satser...",
    "Waiting for quiz to start..." : "Venter på at quizen skal starte...",
    "Waiting for the result..." : "Venter på resultatet...",
    "Answer in " : "Svar i ",
    "Reuse:" : "Gjenbruk:",
    "Won:" : "Vunnet:",
    "Loading..." : "Laster...",
    "Wohoo, you won " : "Wohoo, du vant ",
    "Ahh, none correct :( " : "Huff, ingen rette :( ",
    "You are at " : "Du er på ",
    ". place!" : ". plass!",
    "The Quiz is over" : "Quizen er ferdig",
    "You got " : "Du kom på ",
    "Value +/-" : "Verdi +/-",
    "All" : "Alt",
    "lower" : "lavere",
    "Wrong password. Forgot it? Ask Steinar :)" : "Feil passord! Glemt det? Kontakt Steinar :)",
    "Log On / Sign Up" : "Logg på / Lag bruker",
    "Create new account by logging in with a new user name and password." : "Lag ny konto ved å logge på med nytt brukernavn og passord.",
    "Note: Password is sent and stored in readable text on the server. Do not use a password that should be secret!" : "Merk: Passord sendes ukryptert og lagres i klartekst på server. Ikkje bruk et passord som du bruker andre steder!",
    "Password:" : "Passord:",
    "Questions:" : "Spørsmål:",
    "Question:" : "Spørsmål:",
    "Question " : "Spørsmål ",
    " questions" : " spørsmål",
    "Answer:" : "Svar",
    "Unit:" : "Enhet",
    " of " : " av ",
    "Finished!" : "Ferdig!",
    "Join at: " : "Bli med på: ",
    "Bet at up to two ranges." : "Sats på opp til to alternativer.",
    "Leaderboard:" : "Ledertavle:",
    "Final score:" : "Resultatliste:",
    "Game Over. Thanks for playing!" : "Spelet er slutt. Takk for at du deltok!",
    "Correct: " : "Fasit : "
}