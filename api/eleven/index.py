import os
import subprocess
import json
from http.server import BaseHTTPRequestHandler
from os.path import join, dirname, abspath

from elevenlabs import set_api_key, generate, play
from typing import Iterator

ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")
ELEVEN_CLONE_ID = os.getenv("ELEVEN_CLONE_ID")


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
            # Append to PATH environment variable
            os.environ["PATH"] += ";C:\\Program Files\\ffmpeg\\bin"

            audio = generate(
                    text=data['speech'],
                    voice=ELEVEN_CLONE_ID,  # type: ignore
                    model="eleven_multilingual_v1",
                )

            play(audio)  # type: ignore

            if isinstance(audio, bytes):
                hex_string = audio.hex()
            elif isinstance(audio, Iterator):
                audio_bytes = b"".join(list(audio))
                hex_string = audio_bytes.hex()
            else:
                raise TypeError("Audio is neither a bytes object nor an iterator of bytes")
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
                "responseAudio": hex_string,
            }

            self.wfile.write(json.dumps(response).encode("utf-8"))
        except Exception as e:
            self.send_error(500, f"Failed to create response: {e}")
            return
