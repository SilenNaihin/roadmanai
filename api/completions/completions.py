import json

from api.completions.utils.llm_response import LLM_Response
from api.completions.utils.prompts import (
    ASK_PROMPT,
    TRANSLATE_PROMPT,
    PHONETIC_PROMPT,
)

def generate_response(translateType, text) -> dict[str, str]:

    final_completion: dict[str, str] = {}

    llm_response  = LLM_Response()

    if translateType == "translate":
        final_completion['translate'] = llm_response.model_response(
            chat = [
                {"role": "system", "content": f"{TRANSLATE_PROMPT}"},
                {
                    "role": "system",
                    "content": f"""Original  text: {text}
Roadman translation:""",
                },
            ]
        )
    else:
        final_completion['translate'] = llm_response.model_response(
            chat=[
                {"role": "system", "content": f"{ASK_PROMPT}"},
                {
                    "role": "system",
                    "content": f"""Original text: {text}
Roadman response:""",
                },
            ]
        )

    final_completion['phonetic'] = llm_response.model_response(
        chat=[
            {"role": "system", "content": f"{PHONETIC_PROMPT}"},
            {
                "role": "system",
                "content": f"""Original  text: {final_completion['translate']}
Phonetic translation: Without changing or adding any words return only the translated text that phonetically incorporates the roadman accent""",
            },
        ]
    )

    return final_completion