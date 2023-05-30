import openai
import argparse

# Create the parser
parser = argparse.ArgumentParser(description='File to be transcribed')

# Add the arguments
parser.add_argument('--input', type=str, required=True, help='The input file')
parser.add_argument('--output_dir', type=str, required=True,
                    help='The output directory')

# Parse the arguments
args = parser.parse_args()

audio_file = open(f"{args.output_dir}/{args.input}.mp3", "rb")
transcript = openai.Audio.transcribe("whisper-1", audio_file)
