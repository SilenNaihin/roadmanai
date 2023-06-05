import openai
import argparse
import os

if __name__ == "__main__":
    try:
        # Load .env.local file
        # load_dotenv(".env.local")

        # Now you can access the variable
        OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        openai.api_key = OPENAI_API_KEY

        # Create the parser
        parser = argparse.ArgumentParser(description="File to be transcribed")

        # Add the arguments
        parser.add_argument(
            "--filePath", type=str, required=True, help="The output directory"
        )
        # Parse the arguments
        args = parser.parse_args()

        audio_file = open(args.filePath, "rb")
        transcript = openai.Audio.transcribe("whisper-1", audio_file)

        print(transcript)

    except Exception as e:
        print(f"Error: {e}")
