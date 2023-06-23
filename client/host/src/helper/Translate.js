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

/* 
{T("Add questions here.",this.props.lang)}
</div>
<div className={""}>
{T("",this.props.lang)}
</div>
<div className={""}>
{T("In most cases you should also provide the unit the answer should be given in.",this.props.lang)}
</div>
 */
const Nor = {
    "Add questions here." : "Legg til spørsmål her.",
    "The questions must have numeric answers." : "Spørsmål må ha numeriske svar.",
    "In most cases you should also provide the unit the answer should be given in." : "I de fleste tilfeller bør du også oppgi hvilken enhet svaret skal ha.",
    "Example:" : "Eksempel:",
    "Q: What is the radius of the Earth at the equator?" : "Spm: Hva er Jorden sin radius ved ekvator?",
    "A: 6378.137" : "Svar: 6378.137",
    "Unit: km" : "Enhet: km",
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
    "Create new account by logging in with a new user name." : "Lag ny konto ved å logge på med nytt brukernavn.",
    "Note: Password is sent and stored in readable text on the server. Do not use a password that should be secret!" : "Merk: Passord sendes ukryptert og lagres i klartekst på server. Ikkje bruk et passord du er redd for at andre kan få tak i.",
    "Password:" : "Passord:",
    "Questions:" : "Spørsmål:",
    "Question:" : "Spørsmål:",
    "Question " : "Spørsmål ",
    " q" : " spm",
    " questions" : " spørsmål",
    "Answer:" : "Svar:",
    "Unit:" : "Enhet:",
    " of " : " av ",
    "Finished!" : "Ferdig!",
    "Join at: " : "Bli med på: ",
    "Bet at up to two ranges." : "Sats på opp til to alternativer.",
    "Leaderboard:" : "Ledertavle:",
    "Final score:" : "Resultatliste:",
    "Game Over. Thanks for playing!" : "Spelet er slutt. Takk for at du deltok!",
    "Correct: " : "Fasit : ",
    "Your quizes:" : "Dine quizer:",
    "Rules" : "Regler",
    "Suggest a numerical answer for a question." : "Kom med forslag til svar på et spørsmål (et tall).",
    "Suggestions are sorted from lowest to highest." : "Forslagene sorteres fra lavest til høyest",
    "Bet between which suggestions you think the correct solution lies." : "Sats penger på intervallet der du tror det faktiske svaret ligger."
}