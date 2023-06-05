import openai
import os

# completion settings
COMPLETION_MODEL = "gpt-3.5-turbo"
TEMPERATURE = 0
MAX_TOKENS = 200
COMPLETION_STOP_SEQUENCES = None
COMPLETION_PRESENCE_PENALTY = 0
COMPLETION_FREQUENCY_PENALTY = 0
COMPLETION_API_TIMEOUT = 10
COMPLETION_API_TIMEOUT_ERROR_MESSAGE = "I'm sorry, I'm not able to respond to that question right now. Please try again in a bit"

# openai general settings
# load_dotenv()
os.getenv("OPENAI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def model_response(
    chat: list,
    model: str = COMPLETION_MODEL,
    max_tokens: int = MAX_TOKENS,
    temperature: float = TEMPERATURE,
    presence_penalty: float = COMPLETION_PRESENCE_PENALTY,
    frequency_penalty: float = COMPLETION_FREQUENCY_PENALTY,
    expanded_result: bool = False,
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
        }
        result = openai.ChatCompletion.create(**kwargs)

        if result is None:
            print(
                "ERROR: The function call to the completion API timed out", flush=True
            )
            return ""

        return result.choices[0].message.content  # type: ignore
    except Exception as e:
        return f"{e}"
