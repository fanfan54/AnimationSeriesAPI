/* AnimationSeries.fr WebOS app v2.0.2 beta | Data revision: 19/11/2016 (new!) | (c) Fanfan54 */
// 19/11 : Updated to https animationseries url
// 08/11/2017 : animationseries.fr no longer exists ;( I found how to optimize code: replace "EpisodesDeCodeLyoko.com" by "animationseries" in the comments at the bottom of the page, and do things so getEpisodeVideoSources will still return an array with the language name, even if only one language is selected

// YOUR ATTENTION PLEASE !!!!!
// - The episode Ids for season Code Lyoko are those from CodeLyoko-LeGuide.fr
// - You should not get source for episode 00, instead you should get source for episode -1 and tell the user 00 and -1 redirects to the same video !
// - Support for other series (Miraculous LadyBug) is currently a beta feature

// Error constants
const EPISODE_IS_GARAGEKIDS = "AnimationSeriesAPI: Unfortunately, AnimationSeries.fr is not hosting the Garage Kids project";
const UNKNOWN_EPISODE = "AnimationSeriesAPI: Unknown episode ID";
const COMING_SOON = "AnimationSeriesAPI: Feature not implemented yet, but it is coming soon";
const VIDEO_NOT_FOUND = "AnimationSeriesAPI: This specific video does not exist";
const GENESIS_2_IS_SAME_AS_1 = "AnimationSeriesAPI: Genesis episodes 1 and 2 have been merged into a single video, on AnimationSeries.fr, redirecting to Genesis 1";

// Season ids for Code Lyoko and Code Lyoko Evolution
const CODELYOKO_SERIE = "codelyoko"
const CODELYOKO_SEASON_GENESIS = 0;
const CODELYOKO_SEASON_1 = 1;
const CODELYOKO_SEASON_2 = 2;
const CODELYOKO_SEASON_3 = 3;
const CODELYOKO_SEASON_4 = 4;
const CODELYOKOEVOLUTION_SEASON_1 = 11;

// Season ids for Miraculous LadyBug
const LADYBUG_SERIE = "ladybug"
const LADYBUG_SEASON_1 = 21;
const LADYBUG_SEASON_2 = 22;

const ASER_VIDEO_DEFINITIONS = ["240p","360p","480p","576p","720p","1080p"] // Here are video definitions hosted by www.animationseries.fr

const ASER_LANGUAGES = ["fra","eng"] // Here are audio languages hosted by www.animationseries.fr

function getEpisodeVideoSources(episodeId, episodeLanguage, episodeSerie) {
    // FOR CODELYOKO: episodeId MUST use the CodeLyoko.fr syntax (Evolution starting by 1)
    // episodeLanguage could be "fra" or "eng", or nothing.

    // YOU SHOULD CATCH ERRORS : EPISODE_IS_GARAGEKIDS, GENESIS_2_IS_SAME_AS_1, UNKNOWN_EPISODE and COMING_SOON

    // In this function I should catch VIDEO_NOT_FOUND

    // We have a list of languages : ASER_LANGUAGES and a list of definitions : ASER_VIDEO_DEFINITIONS

    if (typeof episodeLanguage == "undefined") { // If set to nothing, I will return a JavaScript objet containing two arrays for two languages

        var sources = {
            fra: [],
            eng: []
        }

        for (var i = 0, c = ASER_LANGUAGES.length; i < c; i++) { // for each language

            for (var j = 0, d = ASER_VIDEO_DEFINITIONS.length; j < d; j++) { // for each definition
                
                // Let's play try catch
                try {
                    sources[ASER_LANGUAGES[i]].push(getVideoSource(episodeId, episodeSerie, ASER_LANGUAGES[i], ASER_VIDEO_DEFINITIONS[j])) // We add the URL to array
                } catch (ASERException) {
                    // Uh oh, there is an error...
                    if (ASERException == VIDEO_NOT_FOUND)
                        console.log("Skipping "+ASER_LANGUAGES[i]+" "+ASER_VIDEO_DEFINITIONS[j]+" version of "+episodeSerie+" episode "+episodeId+" (season code: "+getEpisodeSeasonById(episodeId, episodeSerie)+") because of video not found")
                    else
                        throw ASERException // Not my fault
                }

            }

        }

    } else { // If set to a language, I will return an array of URLs

        var sources = []

        for (var j = 0, d = ASER_VIDEO_DEFINITIONS.length; j < d; j++) { // for each definition
                
            // Let's play try catch
            try {
                sources.push(getVideoSource(episodeId, episodeSerie, episodeLanguage, ASER_VIDEO_DEFINITIONS[j])) // On ajoute l'URL
             } catch (ASERException) {
                // Uh oh, there is an error...
                if (ASERException == VIDEO_NOT_FOUND)
                    console.log("Skipping "+episodeLanguage+" "+ASER_VIDEO_DEFINITIONS[j]+" "+episodeSerie+" episode "+episodeId+" (season code: "+getEpisodeSeasonById(episodeId, episodeSerie)+") because of video not found")
                else
                    throw ASERException // Not my fault
            }

        }

    }

    // Finally...

    // But, in case the user asked, for example, specifically for English version of CLE, we should throw VIDEO_NOT_FOUND
    if (sources.length < 1) throw VIDEO_NOT_FOUND

    return sources
}

function getEpisodeSeasonById(episodeId, episodeSerie) {
    /* This sub function returns the season number of the selected episode

    # Go to top of file to get the constant ids for seasons

    YOU SHOULD CATCH ERRORS : UNKNOWN_EPISODE and EPISODE_IS_GARAGEKIDS
    */

    if (typeof episodeId == "undefined") throw UNKNOWN_EPISODE

    if (episodeSerie == CODELYOKO_SERIE) {
        if (episodeId == "-273") throw EPISODE_IS_GARAGEKIDS // The Garage Kids ID can't be processed because it's not stored on AnimationSeries.fr

        if (episodeId < -1) throw UNKNOWN_EPISODE

        if (episodeId == -1 || episodeId == 0) return CODELYOKO_SEASON_GENESIS

        if (episodeId < 27) return CODELYOKO_SEASON_1

        if (episodeId < 53) return CODELYOKO_SEASON_2

        if (episodeId < 66) return CODELYOKO_SEASON_3

        if (episodeId < 96) return CODELYOKO_SEASON_4

        if (episodeId > 100 && episodeId < 127) return CODELYOKOEVOLUTION_SEASON_1

    } else if (episodeSerie == LADYBUG_SERIE) {
        if (episodeId < 1) throw UNKNOWN_EPISODE

        if (episodeId < 27) return LADYBUG_SEASON_1

        if (episodeId > 26) return LADYBUG_SEASON_2
    } else throw UNKNOWN_EPISODE

    throw UNKNOWN_EPISODE
}

function getVideoSource(episodeId, episodeSerie, episodeLanguage, videoDefinition) {
    // This function returns a single working link to episode MP4 with selected parameters
    // FOR CODELYOKO: episodeId MUST use the CodeLyoko.fr syntax (Evolution starting by 1)
    // episodeLanguage could be "fra" or "eng"
    // videoDefinition could be : 240p, 360p, 480p, 576p, 720p, 1080p

    // YOU SHOULD CATCH ERRORS : EPISODE_IS_GARAGEKIDS, GENESIS_2_IS_SAME_AS_1, UNKNOWN_EPISODE, COMING_SOON and VIDEO_NOT_FOUND

    // We should throw an exception if this episodeId redirects to another
    if (episodeId == 0 && episodeSerie == CODELYOKO_SERIE) throw GENESIS_2_IS_SAME_AS_1

    // First, let's determine episode season
    var episodeSeason = getEpisodeSeasonById(episodeId, episodeSerie)

    // Now, process seasons
    var episodeSeasonURL; // It's a component of the video URL between videos/ and the episodeId
    switch (episodeSeason) {

        // Code Lyoko
        case CODELYOKOEVOLUTION_SEASON_1:
            episodeSeasonURL = "cle/saison1/cle-"
            break;

        case CODELYOKO_SEASON_GENESIS:
            episodeSeasonURL = "cl/genese/"
            episodeId = 00
            break;

        case CODELYOKO_SEASON_1:
        case CODELYOKO_SEASON_2:
        case CODELYOKO_SEASON_3:
        case CODELYOKO_SEASON_4: // Seasons 1, 2, 3 and 4 have the default season URL
            episodeSeasonURL = "cl/saison"+episodeSeason+"/"
            break;


        // LadyBug
        case LADYBUG_SEASON_1:
            throw COMING_SOON

        case LADYBUG_SEASON_2:
            throw COMING_SOON


        default: // Unknown season means unknown episode
            throw UNKNOWN_EPISODE

    }

    // Let's build our URL. Never trust user input, noob/developer-noob proof verifications.

    // We should format our episodeId to get a length of 2 ! A VERIFIER POUR ANIMATIONSERIES
    episodeId = episodeId.toString();
    if (episodeId.length == 1) episodeId = "0"+episodeId
    if (episodeId.length == 3) episodeId = (episodeId[1]+episodeId[2])
    if (episodeId.length < 1 || episodeId.length > 3) throw UNKNOWN_EPISODE

    // We should format our language
    if (episodeLanguage == "fre" || episodeLanguage == "fr" || episodeLanguage == "french") episodeLanguage = "fra"
    if (episodeLanguage == "en" || episodeLanguage == "english") episodeLanguage = "eng"
    if (typeof episodeLanguage == "undefined" || episodeLanguage != "fra" && episodeLanguage != "eng") throw VIDEO_NOT_FOUND

    // We should format our video definition
    if (typeof videoDefinition == "undefined") throw VIDEO_NOT_FOUND
    if (typeof videoDefinition == "number") videoDefinition = (videoDefinition.toString() + "p")
    if (videoDefinition[videoDefinition.length - 1] != "p") videoDefinition = (videoDefinition + "p")
    if (ASER_VIDEO_DEFINITIONS.indexOf(videoDefinition) < 0) throw VIDEO_NOT_FOUND

    // And here is our URL !
    var episodeSourceURL = ("https://www.animationseries.fr/videos/"+episodeSeasonURL+episodeId+"-"+episodeLanguage+"-"+videoDefinition+".mp4")

    // Now, let's check with XHR if the video exists

    /* 
    /!\ HEY! THIS IS IMPORTANT!
    Due to Cross origin limitations, we can not check if a specific source video is available or not before returning it.
    We'll have to use a PHP script on our server for that.

    To fix this problem, the checker will follow the actual state of files
    on the server, as of 30 October 2016
    
    */

    // And definitions
    
    if (episodeSerie == CODELYOKO_SERIE) {
        if (episodeSeason == CODELYOKOEVOLUTION_SEASON_1) { // If Evolution
            if (videoDefinition == "576p") throw VIDEO_NOT_FOUND // Evolution has everything but 576p

            if (episodeLanguage != "fra") throw VIDEO_NOT_FOUND // Evolution has only french sources
        } else { // If Legacy
            var notLegacyFriendly = ["360p","720p","1080p"]
            if (notLegacyFriendly.indexOf(videoDefinition) > -1) throw VIDEO_NOT_FOUND
        }
    } else throw COMING_SOON
    

    // HEEEEEY! ARE YOU STILL HERE?
    // It means your link should be valid!
    // Let's return it

    return episodeSourceURL
}