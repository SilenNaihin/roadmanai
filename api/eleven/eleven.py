import argparse
import os
from elevenlabs import set_api_key, generate, play
from typing import Iterator

# Load .env.local file
# load_dotenv(".env.local")

# Now you can access the variable
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")
ELEVEN_CLONE_ID = os.getenv("ELEVEN_CLONE_ID")

set_api_key(ELEVEN_API_KEY)  # type: ignore

if __name__ == "__main__":
    # Create the parser
    parser = argparse.ArgumentParser(description="Text to be Roadmanified")

    # Add the arguments
    parser.add_argument("--text", type=str, required=True, help="The output directory")
    # Parse the arguments
    args = parser.parse_args()

    audio = generate(
        text=args.text,
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

    print(hex_string)
