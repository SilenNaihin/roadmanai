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
            self.send_response(200)
            self.send_header("Content-type", "text/plain; charset=utf-8")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self.end_headers()

            print("wer here")

            test_data = ["chunk1", "chunk2", "chunk3", "chunk4"]

            for text in test_data:
                print(text)
                self.wfile.write(f"{text}".encode("utf-8"))
                self.wfile.flush()

            #     if data["type"] == "translate":
            #         model_response(
            #             http_req=self,
            #             stream=True,
            #             chat=[
            #                 {"role": "system", "content": f"{TRANSLATE_PROMPT}"},
            #                 {
            #                     "role": "system",
            #                     "content": f"""Original  text: {data["transcript"]}
            # Roadman translation:""",
            #                 },
            #             ],
            #         )
            #     else:
            #         model_response(
            #             http_req=self,
            #             stream=True,
            #             chat=[
            #                 {"role": "system", "content": f"{ASK_PROMPT}"},
            #                 {
            #                     "role": "system",
            #                     "content": f"""Original text: {data["transcript"]}
            # Roadman response:""",
            #                 },
            #             ],
            #         )

            print("wer here 2 win")
        except Exception as e:
            self.send_error(500, f"Failed to create response: {str(e)}")
            return
