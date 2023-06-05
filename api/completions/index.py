import subprocess
import json
from http.server import BaseHTTPRequestHandler
from os.path import join, dirname, abspath


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
            # Set your script path
            dir = dirname(abspath(__file__))
            script_path = join(dir, "completions.py")

            # Call your script using subprocess
            process = subprocess.Popen(
                [
                    "python",
                    "-m",
                    "api.completions.completions",
                    "--text",
                    f"{data['transcript']}",
                    "--type",
                    f"{data['type']}",
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
            stdout, stderr = process.communicate()
        except Exception as e:
            self.send_error(500, f"Failed to execute script: {e}")
            return

        try:
            # Respond with the data
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            # Extract the JSON portion from stdout
            json_str = stdout.decode("utf-8").strip().split("\n")[-1]

            # Parse the extracted JSON
            json_out = json.loads(json_str)

            # Write the output of the script to the response
            response = {
                "data": data,  # This is the parsed JSON from the request body
                "translation": json_out["translate"],
                "phonetic": json_out["phonetic"],
                "stdout": stdout.decode("utf-8"),  # The stdout from the subprocess
                "stderr": stderr.decode("utf-8"),  # The stderr from the subprocess
            }

            self.wfile.write(json.dumps(response).encode("utf-8"))
        except Exception as e:
            print(f"stdout: {stdout}")
            print(f"stderr: {stderr}")

            json_out = json.loads(stdout.decode("utf-8").strip())
            self.send_error(500, f"Failed to create response: {e}")
            return
