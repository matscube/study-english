#!/bin/sh

# Create a 5 second silence audio file
ffmpeg -f lavfi -t 5 -i anullsrc=channel_layout=stereo:sample_rate=44100 silence_5_seconds.mp3
