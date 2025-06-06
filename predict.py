import sys
import re
import string
import pickle

def preprocess_text(text):
    text = text.lower()
    text = re.sub(f"[{string.punctuation}]", "", text)
    text = re.sub(r"\d+", "", text)
    return text

# load model
with open('hate_speech_model.pkl', 'rb') as f:
    model = pickle.load(f)

# prediksi
if len(sys.argv) > 1:
    input_text = sys.argv[1]
    clean = preprocess_text(input_text)
    prediction = model.predict([clean])[0]
    if prediction == 1:
        print("HATE")
    else:
        print("SAFE")
else:
    print("No input given.")
