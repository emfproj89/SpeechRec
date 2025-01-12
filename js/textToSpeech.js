
//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var speaking = false;
var utter;
var voiceBlob = null; //null - voice not recorded, not null - voice recorded
const synth = window.speechSynthesis;

function onPageLoaded() {
	window.addEventListener("beforeunload", (event) => {
		console.log("beforeunload entered");
		if(voiceBlob != null) {
			event.returnValue = "You have unsaved changes!";
		}
	});
}

//cancel any in progress text-to-speech speaking when leaving the page
window.onunload = function() {
	window.speechSynthesis.cancel();
}

function getAmericanEnglishVoice() {
  // Get available voices
  const voices = synth.getVoices();
  //console.log(">>>name, ", voices);
  // Look for an American English voice (usually contains 'en-US' in the language code)
  const americanVoice = voices.find(voice => voice.lang === 'en-US');
  return americanVoice;
}

//adds the click listener, for text-to-speak image
document.querySelector("#speak-image").addEventListener('click', function() {
	if(document.querySelector("#speak-text").value.trim() != '') {
		var utter = new SpeechSynthesisUtterance();
		utter.text = document.querySelector("#speak-text").value;
		//utter.lang = 'en-US';
		const americanVoice = getAmericanEnglishVoice();
		if (americanVoice) {
			utter.voice = americanVoice;
		} else {
			console.log("american accent not found")
		}

		if (speaking == false) {
			//console.log(">>>start to speak");
			speaking = true;
			window.speechSynthesis.speak(utter);
			utter.onend = function(event) {
				console.log("text-to-speech is done");
				speaking = false; //note, this may be slow and thus this may be called when user clicked the image again!
			}
		}
		else {
			speaking = false;
			//stop the speaking
			//console.log(">>>stops speaking");
			window.speechSynthesis.cancel();
		}		
	}
});
