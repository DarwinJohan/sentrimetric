import sys
import pandas as pd
import re
import string
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.utils import resample

#pakai bayes

# load datasset
df = pd.read_csv('HateSpeechDatasetBalanced.csv')

# preprocessing
def preprocess_text(text):
    text = text.lower() #lowercase text
    text = re.sub(f"[{string.punctuation}]", "", text) #ilangin punctuation
    text = re.sub(r"\d+", "", text) #ilangin angka
    return text

df['clean_text'] = df['Content'].astype(str).apply(preprocess_text)

# balancing dataset (oversample minority class)
df_majority = df[df.Label == 0] #non hate
df_minority = df[df.Label == 1] #hate
df_minority_upsampled = resample(df_minority, replace=True, n_samples=len(df_majority), random_state=42) #duplikasi minotiry scr random biar match sama majority
df_balanced = pd.concat([df_majority, df_minority_upsampled])

# split train test
X_train, X_test, y_train, y_test = train_test_split(df_balanced['clean_text'], df_balanced['Label'], test_size=0.2, random_state=42)

# train nb -> multinomialNB
model = make_pipeline(
    TfidfVectorizer(ngram_range=(1, 2), stop_words='english', max_df=0.95),
    MultinomialNB()
)
model.fit(X_train, y_train)

# evaluasi
# print("Model Evaluation:")
# print(classification_report(y_test, model.predict(X_test)))

# prediksi
if len(sys.argv) > 1:
    input_text = sys.argv[1]
    clean = preprocess_text(input_text)
    prediction = model.predict([clean])[0] #pake trained model yg udh clean
    if prediction == 1:
        print("⚠️ Hate Speech Detected")
    else:
        print("✅ Not Hate Speech")
else:
    print("No input given.")
