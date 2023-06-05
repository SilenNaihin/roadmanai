import subprocess
import json
from http.server import BaseHTTPRequestHandler
from os.path import join, dirname, abspath
import openai

from api.completions.utils.llm_response import LLM_Response
from api.completions.utils.prompts import (
    ASK_PROMPT,
    TRANSLATE_PROMPT,
    PHONETIC_PROMPT,
)


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Parse the request body JSON
            content_length = int(self.headers["Content-Length"])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
        except Exception as e:
            self.send_error(400, f"Failed to parse JSON: {e}")
            return

        try:
            llm_response  = LLM_Response()

            if data["type"] == "translate":
                translate = llm_response.model_response(
                    chat = [
                        {"role": "system", "content": f"{TRANSLATE_PROMPT}"},
                        {
                            "role": "system",
                            "content": f"""Original  text: {data['transcript']}
        Roadman translation:""",
                        },
                    ]
                )
            else:
                translate = llm_response.model_response(
                    chat=[
                        {"role": "system", "content": f"{ASK_PROMPT}"},
                        {
                            "role": "system",
                            "content": f"""Original text: {data['transcript']}
        Roadman response:""",
                        },
                    ]
                )

            phonetic = llm_response.model_response(
                chat=[
                    {"role": "system", "content": f"{PHONETIC_PROMPT}"},
                    {
                        "role": "system",
                        "content": f"""Original  text: {translate}
        Phonetic translation: Without changing or adding any words return only the translated text that phonetically incorporates the roadman accent""",
                    },
                ]
            )
        except Exception as e:
            self.send_error(500, f"Failed to execute script: {e}")
            return

        try:
            # Respond with the data
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            # Write the output of the script to the response
            response = {
                "data": data,  # This is the parsed JSON from the request body
                "translation": translate,
                "phonetic": phonetic,
            }

            self.wfile.write(json.dumps(response).encode("utf-8"))
        except Exception as e:
            self.send_error(500, f"Failed to create response: {e}")
            return
