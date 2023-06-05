import os
from elevenlabs import set_api_key, generate, play
from typing import Iterator

# Now you can access the variable
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")
ELEVEN_CLONE_ID = os.getenv("ELEVEN_CLONE_ID")

set_api_key(ELEVEN_API_KEY)  # type: ignore

def get_and_play_audio(speech: str):
    audio = generate(
        text=speech,
        voice=ELEVEN_CLONE_ID,  # type: ignore
        model="eleven_multilingual_v1",
    )

    if isinstance(audio, bytes):
        hex_string = audio.hex()
    elif isinstance(audio, Iterator):
        audio_bytes = b"".join(list(audio))
        hex_string = audio_bytes.hex()
    else:
        raise TypeError("Audio is neither a bytes object nor an iterator of bytes")

    return hex_string
