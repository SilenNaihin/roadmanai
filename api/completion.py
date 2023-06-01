import argparse
from api.utils.llm_response import model_response

if __name__ == "__main__":
    # Create the parser
    parser = argparse.ArgumentParser(description="Text to be Roadmanified")

    # Add the arguments
    parser.add_argument("--text", type=str, required=True, help="The output directory")
    # Parse the arguments
    args = parser.parse_args()

    # args.text

    chat = [{"role": "system", "content": "Please work blud"}]

    completion = model_response(chat)

    print(completion)
