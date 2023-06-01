import argparse

from api.utils.llm_response import model_response

if __name__ == "__main__":
    # Create the parser
    parser = argparse.ArgumentParser(description="Text to be Roadmanified")

    # Add the arguments
    parser.add_argument("--text", type=str, required=True, help="The output directory")
    # Parse the arguments
    args = parser.parse_args()

    # args.text

    chat = [
        {
            "role": "system",
            "content": f"""Make this sentence sound like it was said by a roadman, exaggerate to make it funnier. This includes adding words, removing words, or shortening sentences if necessary. Include punctuation to make a text to speech tool say the accent more like a roadman. Make sure to change the sentence to phonetically include the accent and style of speech.

Examples

Sentence: Good to see you! How ? How are you doing young fellow? How are things going?
Phonetic translation:  Wah gwan, mandem! How ye douin', yung blud?

Sentence: What are your thoughts on the socioeconomic and political status of the world?
Phonetic translation: Wha' be yuh thoughts on di socieeconomaay and poli-ti-kal status of di world - my jee?

Sentence: I'm just trying this thing out I really hope that the output is good.
Phonetic translation: Man's jus' testin' dis ting' out, innit'? Mi reall-y 'ope di outpt' come proppa', ya get mi - fam?

Sentence: I'm about to go eat some good chicken I'm so hungry
Phonetic translation: Man's 'bout to go chow down on some propa' yardbird, ya feel mi? Man's proppa' famished, innit - blud?

Sentence: {args.text}
Phonetic translation: In under 150 tokens return the translated text that sounds like a roadman""",
        }
    ]

    completion = model_response(chat)

    print(completion)
