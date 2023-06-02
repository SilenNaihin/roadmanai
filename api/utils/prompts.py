TRANSLATE_PROMPT = """Make this sentence sound like it was said by a roadman, exaggerate to make it funnier. This includes adding words, removing words, or shortening sentences if necessary. Change the sentences if necessary, it's ok to add some meaning that wasn't there before but no more than a few words.

Examples

Sentence: Good to see you! How are you doing young fellow?
Roadman translation: Yo fam, wagwan! Safe to catch you out here. How are you doing young blood?

Sentence: What are your thoughts on the socioeconomic and political status of the world?
Roadman translation: What be your thoughts on the socioeconomical and political status of the world, my G?

Sentence: I really hope that the output is good. 
Roadman translation: Man's bare praying for this output to be pure fire, you get me?

Sentence: I'm about to go eat some good chicken I'm so hungry
Roadman translation: Man's 'bout to go chow down on some propa' yardbird, ya feel mi? Man's proppa' famished, innit - blud?"""

PHONETIC_PROMPT = """You will be given the original text and your goal will be to change the sentence to have the accent and style of speech of a roadman when said by a text to speech algorithm. There are a few ways to make this happen:

Pause: simple dash (-) or the em-dash (—).
Example: 

Hesitation: ellipsis (...). 
Example: I... yeah, I guess so, innit

Emphasis or drawl: apostrophize the end of words('). 
Example: nothing -> nothin'

Emotion: punctuation 
Example: "That's propa' funny!!!"

Pacing: write in a style similar to that of a book punctuation wise

Examples of changes
Original text: Me really hope the output come proper, you get me fam?
Phonetic translation: Mi reall-y 'ope di outpt' come proppa', ya get mi - fam

Original text: What be your thoughts on the socioeconomical and political status of the world, my G?
Phonetic translation: Wha' be yuh thoughts on di socieeconomaay and poli-ti-kal status of di world - my jee?

Original text: Yo fam, wagwan! Safe to catch you out here. How are you doing young blood?
Phonetic translation: Yoh fahm wah gwan! Safe teh catch yu out ere'. How ye douin', yung blud?"""

ASK_PROMPT = """Make this sentence sound like it was said by a roadman, exaggerate to make it funnier. This includes adding words, removing words, or shortening sentences if necessary. Change the sentences if necessary, it's ok to add some meaning that wasn't there before.

Examples

Sentence: Good to see you! How are you doing young fellow?
Phonetic translation:  Wah gwan, mandem! How ye douin', yung blud?

Sentence: What are your thoughts on the socioeconomic and political status of the world?
Phonetic translation: Wha' be yuh thoughts on di socieeconomaay and poli-ti-kal status of di world - my jee?

Sentence: I'm just trying this thing out I really hope that the output is good.
Phonetic translation: Man's jus' testin' dis ting' out, innit'? Mi reall-y 'ope di outpt' come proppa', ya get mi - fam?

Sentence: I'm about to go eat some good chicken I'm so hungry
Phonetic translation: Man's 'bout to go chow down on some propa' yardbird, ya feel mi? Man's proppa' famished, innit - blud?"""
