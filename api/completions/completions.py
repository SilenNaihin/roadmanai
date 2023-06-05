import argparse
import json

from api.completions.utils.llm_response import model_response
from api.completions.utils.prompts import (
    ASK_PROMPT,
    TRANSLATE_PROMPT,
    PHONETIC_PROMPT,
)

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

    final_completion: dict[str, str] = {}

    if args.type == "translate":
        final_completion["translate"] = model_response(
            [
                {"role": "system", "content": f"{TRANSLATE_PROMPT}"},
                {
                    "role": "system",
                    "content": f"""Original  text: {args.text}
Roadman translation:""",
                },
            ]
        )
    else:
        final_completion["translate"] = model_response(
            [
                {"role": "system", "content": f"{ASK_PROMPT}"},
                {
                    "role": "system",
                    "content": f"""Original text: {args.text}
Roadman response:""",
                },
            ]
        )

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

    print(json.dumps(final_completion))
