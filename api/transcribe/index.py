import os
import subprocess
import json
from http.server import BaseHTTPRequestHandler
from os.path import join, dirname, abspath
from urllib.parse import parse_qs
import cgi
import datetime
import tempfile


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        filePath = None
        try:
            ctype, pdict = cgi.parse_header(self.headers["content-type"])

            if ctype == "multipart/form-data":
                fs = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={
                        "REQUEST_METHOD": "POST",
                        "CONTENT_TYPE": self.headers["content-type"],
                    },
                )

                if "audioFile" not in fs:
                    self.send_error(400, "No file selected")
                    return

                fileitem = fs["audioFile"]

                # Determine the file extension
                filename = fileitem.filename
                extension = os.path.splitext(filename)[-1]

                if not fileitem.file:
                    self.send_error(400, "No file uploaded")
                    return

                # Create a temporary file and write the uploaded file's content to it
                fd, filePath = tempfile.mkstemp(suffix=extension)

                with open(fd, "wb") as tmp:
                    tmp.write(fileitem.file.read())

        except Exception as e:
            self.send_error(400, f"Failed to parse form-data: {e}")
            return

        # Check if file was uploaded
        if filePath is None:
            self.send_error(400, "No file uploaded")
            return

        try:
            dir = dirname(abspath(__file__))
            script_path = join(dir, "transcribe.py")
            # Call your script using subprocess
            process = subprocess.Popen(
                [
                    "python",
                    "api/transcribe/whisper.py",
                    "--filePath",
                    filePath,
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
            stdout, stderr = process.communicate()
        except Exception as e:
            self.send_error(500, f"Failed to execute script: {e}")
            return

        os.remove(filePath)

        try:
            # Respond with the data
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            # Add these lines to debug stdout and stderr
            print(f"stdout: {stdout}")
            print(f"stderr: {stderr}")

            # Parse the stdout from the script
            json_out = json.loads(stdout.decode("utf-8").strip())

            print(f"json_out: {json_out} {type(json_out)}")

            # Write the output of the script to the response
            response = {
                "transcript": json_out,  # The stdout from the subprocess
                "stderr": stderr.decode("utf-8"),  # The stderr from the subprocess
            }

            self.wfile.write(json.dumps(response, ensure_ascii=False).encode("utf-8"))
        except Exception as e:
            print(f"stdout: {stdout}")
            print(f"stderr: {stderr}")

            json_out = json.loads(stdout.decode("utf-8").strip())

            print(f"json_out: {json_out} {type(json_out)}")
            self.send_error(500, f"Failed to create response: {e}")
            return
