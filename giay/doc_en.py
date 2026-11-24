# Reads [[voice, text, wav_path], ...] from the JSON file named in argv[1] and writes every line with Kokoro-82M
# (weights and code Apache 2.0, so the audio may be monetised; its espeak-ng fallback is GPL-3.0, which does not reach the audio). Run by doc.js with the venv in ~/ai-models/kokoro.
import json
import os
import sys

import numpy as np
import soundfile as sf
from kokoro import KPipeline

pipes = {}
for voice, text, out in json.load(open(sys.argv[1])):
    # the first letter of a Kokoro voice is its language: a = American English, b = British English
    lang = voice[0]
    if lang not in pipes:
        pipes[lang] = KPipeline(lang_code=lang, repo_id="hexgrad/Kokoro-82M")
    chunks = [chunk for _, _, chunk in pipes[lang](text, voice=voice)]
    if not chunks:
        sys.exit(f"Kokoro produced no audio for: {text}")
    audio = np.concatenate(chunks)
    part = out + ".part.wav"
    sf.write(part, audio, 24000)
    os.replace(part, out)
    print("ok", os.path.basename(out), flush=True)
