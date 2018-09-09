# AnimationSeriesAPI
A random JS "library" I hard-coded in 2016, regardless of good practices, as an API for the (now closed) AnimationSeries.fr anime streaming website. I am not affiliated with AnimationSeries.

## How to use
Just import the script in your HTML app like this:
```html
<script src="AnimationSeriesAPI.js"></script>
```
Then, call one of these methods (they're not even in an object, they will be added directly into the DOM) :
* getEpisodeVideoSources(episodeId, episodeLanguage, episodeSerie)
It returns a Javascript object that contains the requested video URLs. If you set episodeLanguage, it will return **an array of strings (video URLs)**. If you did not set it, it will return **an indexed object with two items, "fra" and "eng", and each one contains an array of strings (video URLs)**.
It can throw the following exceptions: EPISODE_IS_GARAGEKIDS, GENESIS_2_IS_SAME_AS_1, UNKNOWN_EPISODE and COMING_SOON
* getEpisodeSeasonById(episodeId, episodeSerie)
It returns one of the following integer constants : CODELYOKO_SEASON_1, CODELYOKO_SEASON_2, CODELYOKO_SEASON_3, CODELYOKO_SEASON_4, LADYBUG_SEASON_1, or LADYBUG_SEASON_2.
It can throw the following exceptions: UNKNOWN_EPISODE and EPISODE_IS_GARAGEKIDS
* getVideoSource(episodeId, episodeSerie, episodeLanguage, videoDefinition)
It returns a string (the requested video URL).
It can throw the following exceptions: EPISODE_IS_GARAGEKIDS, GENESIS_2_IS_SAME_AS_1, UNKNOWN_EPISODE, COMING_SOON and VIDEO_NOT_FOUND 

Here are the possible values for:
* episodeId: any integer (including negative ones, or zero)
* episodeLanguage: "fra", "eng", or null
* episodeSerie: "codelyoko" or "ladybug"
* videoDefinition: "240p", "360p", "480p", "576p", "720p" or "1080p"

Enjoy! But the hosting server (AnimationSeries.fr) is discontinued, the owner confirmed me that it's because he no longer has free time to maintain the website.

## Some Javascript bookmarklets (in french) that use this API (also in the public domain)
This is a condensed version of the API that asks the arguments of getVideoSource in JS prompts.
```javascript
edclid=prompt("Ce bookmarklet trouve le fichier MP4 de n'importe quel épisode de Code Lyoko (Ladybug bientôt disponible). Entrez le numéro A DEUX CHIFFRES de l'épisode à regarder (dispo sur www.codelyoko-leguide.fr)");edclvp="",edclvs="576",edclsurl='z';if(edclid<1){edclsurl="cl/genese/",edclid="00"}else if(edclid<26){if(confirm("Cliquez sur OK si c'est un épisode Evolution")){edclsurl="cle/saison1/",edclvp="cle-",edclvs="720"}else{edclsurl="cl/saison1/"}}else if(edclid==27){edclsurl="cl/saison1/"}else if(edclid<53){edclsurl="cl/saison2/"}else if(edclid<66){edclsurl="cl/saison3/"}else if(edclid<96){edclsurl="cl/saison4/"}else{alert("Episode inconnu")}if(edclsurl!='z'){edcll="-fra-";if(edclsurl!="cle/saison1/"){if(!confirm("Annuler : English, OK : Francais")){edcll="-eng-"}}window.open("https://www.animationseries.fr/videos/"+edclsurl+edclvp+edclid+edcll+edclvs+"p.mp4")}
```

This is an interesting one. It hacks into the main page of https://www.codelyoko-leguide.fr to add download links for every episode using the API.
```javascript
if(location.href=="http://www.codelyoko-leguide.fr/"){edcl=document.createElement("script");edcl.src="https://github.com/fanfan54/AnimationSeriesAPI/raw/master/AnimationSeriesAPI.js";document.body.appendChild(edcl);setTimeout(function(){var chaquetitre=document.querySelectorAll(".cadre_centre td b");for(var i=0,c=chaquetitre.length;i<c;i++){window.gkskip=0;var eid=chaquetitre[i].firstChild.href.substr(32);if(eid!=0){try{var scz=getEpisodeVideoSources(eid,"fra","codelyoko")}catch(eizu){window.gkskip=1}}if(window.gkskip==0){if(getEpisodeSeasonById(eid,"codelyoko")==11){chaquetitre[i].innerHTML=(chaquetitre[i].innerHTML+'<br><a href="#" onclick="window.open(\''+scz[3]+'\');return false;">[Regarder en HD]</a>')}else{chaquetitre[i].innerHTML=(chaquetitre[i].innerHTML+'<br><a href="#" onclick="window.open(\''+scz[2]+'\');return false;">[Regarder en 576p]</a>')}}}document.getElementsByClassName("revolution_titre")[0].textContent="Vidéos de AnimationSeries.fr ;-)"},2000);}else if(location.host=="www.codelyoko-leguide.fr"&&location.pathname.length<5&&location.pathname.length>1){edcl=document.createElement("script");edcl.src="http://pastebin.com/raw/ftQQfPv7";document.body.appendChild(edcl);setTimeout(function(){window.gkskip=0;var eid=location.pathname.split('/')[1];if(eid!=0){try{var scz=getEpisodeVideoSources(eid,"fra","codelyoko")}catch(eizu){window.gkskip=1}}if(window.gkskip==0){if(getEpisodeSeasonById(eid,"codelyoko")==11){window.open(scz[3]);}else{window.open(scz[2]);}}},2000);}else{alert("www.codelyoko-leguide.fr va s'ouvrir dans un nouvel onglet.\nUtilisez le bookmarklet là-bas !");window.open("http://www.codelyoko-leguide.fr/");}
```

## License
I coded everything myself, this project contains no restricted content.

I decided to release the code in the public domain.

**Disclaimer: I am not affiliated with neither AnimationSeries nor CodeLyoko.fr.**
