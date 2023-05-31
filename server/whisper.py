import openai
import argparse
from dotenv import load_dotenv
import os

# Load .env.local file
load_dotenv('.env.local')

# Now you can access the variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
openai.api_key = OPENAI_API_KEY

# Create the parser
parser = argparse.ArgumentParser(description='File to be transcribed')

# Add the arguments
parser.add_argument('--filePath', type=str,
                    required=True, help='The output directory')
# Parse the arguments
args = parser.parse_args()

print(f"{args.output_dir}/{args.input}", flush=True)

audio_file = open(f"{args.filePath}", "rb")
transcript = openai.Audio.transcribe("whisper-1", audio_file)

print(transcript)
