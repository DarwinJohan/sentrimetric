import sys
import pandas as pd
import re
import string
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split

# Load dataset & train model
df = pd.read_csv('HateSpeechDatasetBalanced.csv')

def preprocess_text(text):
    text = text.lower()
    text = re.sub(f"[{string.punctuation}]", "", text)
    text = re.sub(r"\d+", "", text)
    return text

df['clean_text'] = df['Content'].astype(str).apply(preprocess_text)
X_train, _, y_train, _ = train_test_split(df['clean_text'], df['Label'], test_size=0.2, random_state=42)

model = make_pipeline(TfidfVectorizer(), MultinomialNB())
model.fit(X_train, y_train)

# Get input from command-line
if len(sys.argv) > 1:
    input_text = sys.argv[1]
    clean = preprocess_text(input_text)
    prediction = model.predict([clean])[0]
    label = "Hate Speech" if prediction == 1 else "Not Hate Speech"
    print(label)
else:
    print("No input given.")
