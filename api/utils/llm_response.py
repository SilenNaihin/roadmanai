import os
import openai
from typing import Optional, List, Dict
from http.server import BaseHTTPRequestHandler
import json

COMPLETION_MODEL = "gpt-3.5-turbo"
TEMPERATURE = 0
MAX_TOKENS = 200
COMPLETION_STOP_SEQUENCES = None
COMPLETION_PRESENCE_PENALTY = 0
COMPLETION_FREQUENCY_PENALTY = 0
COMPLETION_API_TIMEOUT = 10
COMPLETION_API_TIMEOUT_ERROR_MESSAGE = "I'm sorry, I'm not able to respond to that question right now. Please try again in a bit"

os.getenv("OPENAI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def model_response(
    chat: List[Dict[str, str]],
    http_req: Optional[BaseHTTPRequestHandler] = None,
    stream: bool = False,
    model: str = COMPLETION_MODEL,
    max_tokens: int = MAX_TOKENS,
    temperature: float = TEMPERATURE,
    presence_penalty: float = COMPLETION_PRESENCE_PENALTY,
    frequency_penalty: float = COMPLETION_FREQUENCY_PENALTY,
) -> str:
    try:
        kwargs = {
            # settings
            "model": model,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "presence_penalty": presence_penalty,
            "frequency_penalty": frequency_penalty,
            "messages": chat,
            "api_key": OPENAI_API_KEY,
            "stream": stream,
        }
        print("starting streaming")
        if stream and http_req:
            for chunk in openai.ChatCompletion.create(**kwargs):
                if chunk.choices[0].delta.get("content"):  # type: ignore
                    text = chunk.choices[0].delta.content  # type: ignore
                    print(text)
                    http_req.wfile.write(f"{text}\n\n".encode("utf-8"))
                    http_req.wfile.flush()
            return ""

        result = openai.ChatCompletion.create(**kwargs)

        if result is None:
            print(
                "ERROR: The function call to the completion API timed out", flush=True
            )
            return ""

        return result.choices[0].message.content  # type: ignore
    except Exception as e:
        if http_req:
            http_req.send_error(500, f"Failed to create response: {str(e)}")
            return ""
        return f"{e}"
