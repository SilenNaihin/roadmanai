import json
from http.server import BaseHTTPRequestHandler

from api.utils.prompts import (
    PHONETIC_PROMPT,
)
from api.utils.llm_response import model_response


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
            phonetic = model_response(
                chat=[
                    {"role": "system", "content": f"{PHONETIC_PROMPT}"},
                    {
                        "role": "system",
                        "content": f"""Original  text: {data["translation"]}
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
                "phonetic": phonetic,
            }

            self.wfile.write(json.dumps(response).encode("utf-8"))
        except Exception as e:
            self.send_error(500, f"Failed to create response: {e}")
            return
