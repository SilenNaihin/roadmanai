import argparse

from api.utils.llm_response import model_response
from api.utils.prompts import ASK_PROMPT, TRANSLATE_PROMPT, PHONETIC_PROMPT

if __name__ == "__main__":
    # Create the parser
    parser = argparse.ArgumentParser(description="Text to be Roadmanified")

    # Add the arguments
    parser.add_argument(
        "--text", type=str, required=True, help="Text to change to roadman"
    )
    parser.add_argument("--type", type=str, required=True, help="Type of change")
    # Parse the arguments
    args = parser.parse_args()

    final_completion: dict[str, str] = {
        "translate": model_response(
            [
                {"role": "system", "content": f"{TRANSLATE_PROMPT}"},
                {
                    "role": "system",
                    "content": f"""Original  text: {args.text}
Roadman translation: In under 150 tokens return the translated text that sounds like a roadman""",
                },
            ]
        )
        if args.type == "translate"
        else model_response(
            [
                {"role": "system", "content": f"{ASK_PROMPT}"},
                {
                    "role": "system",
                    "content": f"""Sentence: {args.text}
Phonetic translation: In under 150 tokens respond in the style and form of a roadman""",
                },
            ]
        )
    }

    final_completion["phonetic"] = model_response(
        [
            {"role": "system", "content": f"{PHONETIC_PROMPT}"},
            {
                "role": "system",
                "content": f"""Original  text: {final_completion["translate"]}
Phonetic translation: Without changing or adding any words return only the translated text that phonetically incorporates the roadman accent""",
            },
        ]
    )

    print(final_completion)
