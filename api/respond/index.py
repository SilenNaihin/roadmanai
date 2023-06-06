import json
from http.server import BaseHTTPRequestHandler

from api.utils.prompts import (
    ASK_PROMPT,
    TRANSLATE_PROMPT,
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
            if data["type"] == "translate":
                translation = model_response(
                    chat=[
                        {"role": "system", "content": f"{TRANSLATE_PROMPT}"},
                        {
                            "role": "system",
                            "content": f"""Original  text: {data["transcript"]}
        Roadman translation:""",
                        },
                    ],
                )
            else:
                translation = model_response(
                    chat=[
                        {"role": "system", "content": f"{ASK_PROMPT}"},
                        {
                            "role": "system",
                            "content": f"""Original text: {data["transcript"]}
        Roadman response:""",
                        },
                    ],
                )
        except Exception as e:
            self.send_error(500, f"Failed to execute script: {e}")
            return

        try:
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            # Write the output of the script to the response
            response = {
                "data": data,  # This is the parsed JSON from the request body
                "translation": translation,
            }

            self.wfile.write(json.dumps(response).encode("utf-8"))

        except Exception as e:
            self.send_error(500, f"Failed to create response: {str(e)}")
            return
